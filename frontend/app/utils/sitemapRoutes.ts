interface Locale {
  code: string;
  isDefault?: boolean;
}

interface Page {
  slug: string;
  updatedAt?: string;
}

interface ApiList<T> {
  data?: T[];
}

/** Sitemap route returned to the Nuxt server and browser preview. */
export interface SitemapRoute {
  loc: string;
  lastmod?: string;
}

async function getRoutes(
  locale: Locale,
  baseUrl: string,
): Promise<SitemapRoute[]> {
  const filters =
    '&filters[$and][0][$or][0][seo][robots][$null]=true&filters[$and][0][$or][1][seo][robots][$notContainsi]=noindex';
  const response = await fetch(
    `${baseUrl}/api/pages?pagination[pageSize]=200&locale=${locale.code}${filters}`,
  );
  const routes = (await response.json()) as ApiList<Page>;

  return (routes.data || []).map((page) => {
    const localePath = locale.isDefault ? '' : `/${locale.code}`;
    const slug = page.slug === 'main' ? '' : page.slug;
    const fullPath = slug ? `/${slug}` : '/';
    return {
      loc: localePath + (fullPath === '/' ? '' : fullPath),
      lastmod: page.updatedAt,
    };
  });
}

/**
 * Fetches all localized Strapi pages and returns fulfilled sitemap routes.
 * A failed locale is omitted while successful locale requests are retained.
 * @param strapiUrl - Strapi base URL.
 * @returns Routes from every fulfilled locale request.
 * @example await generateSitemapRoutes('https://cms.example.com')
 */
export default async function generateSitemapRoutes(
  strapiUrl: string,
): Promise<SitemapRoute[]> {
  const languageResponse = await fetch(`${strapiUrl}/api/i18n/locales`);
  const locales = ((await languageResponse.json()) as Locale[]) || [];
  const results = await Promise.allSettled(
    locales.map((locale) => getRoutes(locale, strapiUrl)),
  );

  return results.flatMap((result) =>
    result.status === 'fulfilled' && result.value ? result.value : [],
  );
}
