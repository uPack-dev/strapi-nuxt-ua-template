import { useRouteParams } from '@/composables/useRouteParams';

/**
 * @param collection - Strapi collection name.
 * @param params - Filters, populate, and pagination parameters.
 * @returns Strapi response, or `{ data: [] }` after a request failure.
 * @example await useCollectionRequest('articles', { filters: {}, populate: [] })
 */
export const useCollectionRequest = async (
  collection: string,
  params: Record<string, any> = { filters: {}, populate: [], pagination: {} },
) => {
  const { find } = useStrapi();
  const {
    public: { isDev },
  } = useRuntimeConfig();
  const route = useRouteParams([]);
  const { lang, page, slug } = route;

  const filters = { ...(params.filters || {}) };

  if (page === collection && slug) {
    filters.slug = { ...filters.slug, $ne: slug };
  }

  const query = { ...params, filters, locale: lang };
  const { data, error } = await useAsyncData(
    `strapi-collection:${collection}:${JSON.stringify(query)}`,
    () => find(collection, query as any),
  );

  if (error.value || !data.value) {
    if (isDev)
      console.error(`Error fetching collection [${collection}]:`, error.value);
    return { data: [] };
  }

  return data.value;
};
