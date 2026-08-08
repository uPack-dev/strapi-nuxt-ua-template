import generateSitemapRoutes from '~/utils/sitemapRoutes';

const STORAGE_KEY = 'sitemap:xml';

/**
 * Вызывает generateSitemapRoutes, строит XML и сохраняет в Nitro storage.
 * Возвращает готовый XML-контент.
 */
export async function buildAndStoreSitemap() {
  const config = useRuntimeConfig();
  const strapiUrl = config.strapi?.url || config.serverUrl;
  const siteUrl = config.public?.siteUrl;

  if (!strapiUrl) {
    throw new Error('[generateSitemap] NUXT_SERVER_URL is not defined');
  }

  // Вызываем utility sitemapRoutes — он идёт в Strapi за свежими URL.
  const routes = await generateSitemapRoutes(strapiUrl);

  const xml = buildXml(routes, siteUrl);

  // Сохраняем в Nitro storage, чтобы /sitemap.xml мог отдать без повторной генерации
  const storage = useStorage('sitemap');
  await storage.setItem(STORAGE_KEY, xml);

  return { xml, count: routes.length };
}

/**
 * Достаёт XML из storage. Если его нет — генерирует и сохраняет.
 */
export async function getOrBuildSitemap() {
  const storage = useStorage('sitemap');
  const cached = await storage.getItem(STORAGE_KEY);

  if (cached) {
    return cached;
  }

  const { xml } = await buildAndStoreSitemap();
  return xml;
}

function buildXml(routes, siteUrl) {
  const base = (siteUrl || '').replace(/\/$/, '');
  const urlEntries = routes
    .map((route) => {
      const loc = route.loc.startsWith('http')
        ? route.loc
        : `${base}${route.loc}`;

      const lastmod = route.lastmod
        ? `\n    <lastmod>${route.lastmod.slice(0, 10)}</lastmod>`
        : '';

      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/__sitemap__/style.xsl"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urlEntries +
    `\n</urlset>`
  );
}
