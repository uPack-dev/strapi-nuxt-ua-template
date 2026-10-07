import { afterEach, expect, it, vi } from 'vitest';

import { BLOCKS } from '@/configs/blocks';
import { useCollectionRequest } from './useCollectionRequest';
import { useBlocksRequest } from './useBlocksRequest';

vi.mock('@/configs/blocks', () => ({
  BLOCKS: {
    'template-block': {
      request: {
        collection: 'pages',
        params: { filters: { title: { $eq: 'Related' } } },
        pagination: { pageSize: 4 },
      },
    },
  },
}));
vi.mock('@/composables/useCollectionRequest', () => ({
  useCollectionRequest: vi.fn(async () => ({ data: [] })),
}));

afterEach(() => vi.unstubAllGlobals());

it('keeps every shared child in place without changing CMS or request data', async () => {
  vi.stubGlobal('useRoute', () => ({ query: { page: 2 } }));
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { isDev: false } }));
  const direct = {
    __component: 'blocks.template-block',
    id: 1,
    title: 'Direct',
  };
  const shared = {
    __component: 'blocks.reusable',
    id: 2,
    block: {
      global: [
        { __component: 'blocks.template-block', id: 1, title: 'First' },
        { __component: 'blocks.template-block', id: 2, title: 'Second' },
      ],
    },
  };
  const blocks = [
    direct,
    shared,
    direct,
    shared,
    { __component: 'blocks.reusable' },
  ];
  const before = structuredClone({ blocks, registry: BLOCKS });
  const result = await useBlocksRequest(blocks);

  expect(result?.map((block) => block.title)).toEqual([
    'Direct',
    'First',
    'Second',
    'Direct',
    'First',
    'Second',
  ]);
  expect({ blocks, registry: BLOCKS }).toEqual(before);
  expect(useCollectionRequest).toHaveBeenCalledWith('pages', {
    filters: { title: { $eq: 'Related' } },
    pagination: { page: 2, pageSize: 4 },
  });
  expect(await useBlocksRequest()).toEqual([]);
});
