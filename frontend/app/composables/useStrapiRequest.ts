import {
  BASE_POPULATE,
  PAGE_POPULATE,
  PAGES_POPULATE,
  SEO_POPULATE,
} from '@/configs/populates';
import { isEmptyStrapiResponse } from '@/utils/strapiData';
interface RouteLookup {
  page?: string;
  slug?: string;
  lang?: string;
}

/**
 * @param page - Strapi collection name.
 * @param slug - Page slug.
 * @param route - Parsed route used for the invalid nested-pages guard.
 * @returns Normalized blocks, SEO, and main record fields.
 * @example await useStrapiRequest('pages', 'about')
 */
export const useStrapiRequest = async (
  page: string,
  slug: string,
  route: RouteLookup = {},
) => {
  const { find } = useStrapi<Record<string, any>>();

  if (route.page === 'pages' && route.slug) {
    throw createError({
      status: 404,
      message: 'Page Not Found',
      fatal: true,
    });
  }

  const pageName = page === 'pages' ? page + '-' + slug : `${page}-item`;
  const pagePopulate = PAGE_POPULATE[pageName] || [];

  let populate = [...SEO_POPULATE, ...pagePopulate, ...BASE_POPULATE];
  if (page === 'pages') populate = [...populate, ...PAGES_POPULATE];
  populate = [...new Set(populate)];

  const { data, error } = await useAsyncData(
    `strapi-page:${page}:${slug}:${route.lang || 'default'}`,
    async () => {
      let response = await find(page, {
        filters: { slug: { $eq: slug } },
        populate,
        locale: route.lang,
      } as any);
      // page not yet translated to the requested locale → default-locale version
      if (isEmptyStrapiResponse(response) && route.lang) {
        response = await find(page, {
          filters: { slug: { $eq: slug } },
          populate,
        } as any);
      }
      if (isEmptyStrapiResponse(response)) return null;

      const records = response.data as unknown as Array<Record<string, any>>;
      const { blocks, seo, ...mainInfo } = (records[0] || {}) as Record<
        string,
        any
      >;

      return { blocks: blocks || [], seo: seo || {}, mainInfo: mainInfo || {} };
    },
  );

  if (error.value || !data.value) {
    throw createError({
      status: 404,
      message: 'Page Not Found',
      fatal: true,
    });
  }

  return data.value;
};
