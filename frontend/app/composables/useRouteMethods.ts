import { getRouteLocale } from '@/utils/locale';

/**
 * @returns Locale-aware route helpers.
 * @example useRouteMethods().toLocalePath('/about') // '/about' (default) or '/ru/about'
 */
export const useRouteMethods = () => {
  /** @param path - Site-relative path. @returns Path prefixed by active/default locale. */
  function toLocalePath(path: string): string {
    // hash/query-only and non-path links (tel:, mailto:) stay as is
    if (!path.startsWith('/')) return path;

    const globalStore = useGlobalStore();
    // locales fetch can fail → store holds `{}` instead of an array
    const $languages = Array.isArray(globalStore.languages)
      ? globalStore.languages
      : [];
    const route = useRoute();

    const defaultLang = $languages.find((locale) => locale.isDefault)?.code;
    const pageLang = getRouteLocale(route.path, $languages);

    // default locale is prefix-less
    if (pageLang === defaultLang) return path;

    // idempotent: path already carries a locale prefix
    if (getRouteLocale(path, $languages) !== defaultLang) return path;

    return `/${pageLang}${path}`;
  }

  return { toLocalePath };
};
