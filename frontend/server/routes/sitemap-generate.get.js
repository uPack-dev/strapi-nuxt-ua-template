import { buildAndStoreSitemap } from '../utils/generateSitemap.js';

/**
 * GET /sitemap-generate?value=<hash>
 *
 * Принудительно вызывает generateSitemapRoutes (идёт в Strapi за свежими урлами),
 * строит новый XML и сохраняет в Nitro storage.
 * После этого /sitemap.xml отдаст обновлённый файл.
 *
 * Требует GET-параметр value равный NUXT_SITEMAP_GENERATE_HASH из env.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const expectedHash = config.sitemapGenerateHash;

  if (!expectedHash) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'NUXT_SITEMAP_GENERATE_HASH is not configured on the server',
    });
  }

  const { value } = getQuery(event);

  if (!value || value !== expectedHash) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid hash',
    });
  }

  const start = Date.now();
  const { count } = await buildAndStoreSitemap();

  return {
    success: true,
    urlCount: count,
    duration: `${Date.now() - start}ms`,
    message: `Sitemap regenerated with ${count} URLs. Available at /sitemap.xml`,
  };
});
