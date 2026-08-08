import { getOrBuildSitemap } from '../utils/generateSitemap.js';

/**
 * GET /sitemap.xml
 *
 * Provides the project sitemap response.
 * Отдаёт XML из Nitro storage. Если кэш пуст (первый запуск или после
 * инвалидации) — вызывает generateSitemapRoutes и кэширует результат.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  const xml = await getOrBuildSitemap();
  return xml;
});
