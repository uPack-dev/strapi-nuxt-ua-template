interface RouteLocale {
  code: string;
  isDefault?: boolean;
}

/**
 * Resolves the active locale from a route path.
 * @param path - Route path without query or hash.
 * @param locales - Available locales.
 * @returns Matched route locale or the default locale.
 * @example getRouteLocale('/en/catalog', [{ code: 'uk', isDefault: true }, { code: 'en' }]) // 'en'
 */
export const getRouteLocale = (
  path: string,
  locales: RouteLocale[],
): string | undefined => {
  const firstSegment = path.split('/').filter(Boolean)[0];

  return locales.some((locale) => locale.code === firstSegment)
    ? firstSegment
    : locales.find((locale) => locale.isDefault)?.code;
};

/**
 * Removes a configured locale prefix from a route path.
 * @param path - Route path without query or hash.
 * @param locales - Available locales.
 * @returns Prefix-less route path.
 * @example stripRouteLocale('/en/catalog', [{ code: 'en' }]) // '/catalog'
 */
export const stripRouteLocale = (
  path: string,
  locales: RouteLocale[],
): string => {
  const segments = path.split('/').filter(Boolean);

  if (locales.some((locale) => locale.code === segments[0])) segments.shift();

  return `/${segments.join('/')}`;
};
