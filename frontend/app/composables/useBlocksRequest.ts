import { BLOCKS } from '@/configs/blocks';
import { useCollectionRequest } from '@/composables/useCollectionRequest';

/**
 * @param blocks - Strapi block records.
 * @returns Blocks enriched with requested collection data, or `undefined` on failure.
 * @example await useBlocksRequest([{ __component: 'blocks.hero' }])
 */
export const useBlocksRequest = async (blocks: Array<Record<string, any>>) => {
  const route = useRoute();
  const {
    public: { isDev },
  } = useRuntimeConfig();
  const config = blocks.map((block) => {
    const item = block.block?.global?.length ? block.block?.global[0] : block;
    return {
      ...BLOCKS[componentName(item.__component)],
      ...item,
    };
  });

  function componentName(blockName: string): string {
    const cArrayData = blockName.split('.');

    return cArrayData.length > 1
      ? cArrayData.at(-1) || ''
      : cArrayData[0] || '';
  }

  function createRequest(block: Record<string, any>) {
    if (block.request) {
      const params = block.request.params || {};
      params.pagination = {
        page: route.query.page || 1,
        pageSize: block.pageSize || block.request?.pagination?.pageSize,
      };
      return useCollectionRequest(block.request.collection, params);
    }
  }

  function createRequestsArray() {
    return config.map((block) => {
      return block.request
        ? !Array.isArray(block.request)
          ? createRequest(block)
          : Promise.all(
              block.request.map((r: Record<string, any>) =>
                createRequest({ ...block, request: r }),
              ),
            )
        : undefined;
    });
  }

  try {
    const result = await Promise.all(createRequestsArray());
    return result.map((item, index) => {
      if (!item) {
        return config[index];
      } else if (Array.isArray(item)) {
        const res = { ...config[index] };
        item.forEach((data, i) => {
          res[config[index].request[i].collection] = data.data;
          if (config[index].request[i].pagination) {
            res.meta = data.meta;
          }
        });
        return res;
      } else {
        const response = item as { data: unknown; meta?: unknown };
        return { ...config[index], items: response.data, meta: response.meta };
      }
    });
  } catch (e) {
    if (isDev) console.error(e);
  }
};
