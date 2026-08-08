import { useGlobalStore } from '@/stores/global';
import { getRouteLocale } from '@/utils/locale';
import { tryOnScopeDispose } from '@vueuse/core';

/**
 * Extracts the last segment (slug) from a URL.
 * @param url - URL or path with optional query/hash.
 * @returns Final path segment, or `''` for empty input.
 * @example extractSlugFromUrl('/news/item?page=2') // 'item'
 */
export const extractSlugFromUrl = (url: string): string => {
  if (!url) return '';
  const path = url.split(/[?#]/)[0] || '';
  const segments = path.replace(/^\/|\/$/g, '').split('/');
  return segments.at(-1) || '';
};

/**
 * Derives locale and page segments from the current route.
 * @param languages - Fallback locales when the global store is empty.
 * @returns Reactive route fields and a recalculation function.
 * @example useRouteParams([{ code: 'en', isDefault: true }])
 */
export const useRouteParams = (
  languages: Array<{ code: string; isDefault?: boolean }> = [],
) => {
  const globalStore = useGlobalStore();
  const route = useRoute();

  // locales fetch can fail → store holds `{}` instead of an array
  const $languages = Array.isArray(globalStore.languages)
    ? globalStore.languages
    : null;
  const locales = $languages || languages || [];
  const localesCodes = locales.map((l) => l.code);

  function calcParams() {
    const rawSegments =
      route.params.all || route.path.split('/').filter(Boolean);
    const segments = Array.isArray(rawSegments)
      ? [...rawSegments]
      : rawSegments.split('/');

    const lang = getRouteLocale(route.path, locales) || localesCodes[0];
    let pathSegments = segments;

    const firstSegment = segments[0];
    if (firstSegment && localesCodes.includes(firstSegment)) {
      pathSegments = segments.slice(1);
    }

    let slug = '';
    let page = '';
    let categories: string[] = [];
    let parentPath = '';

    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0] || '';
      const lastSegment =
        (pathSegments.length > 1 && pathSegments[pathSegments.length - 1]) ||
        '';

      page = firstSegment;
      slug = lastSegment;
      categories = (pathSegments.length > 2 && pathSegments.slice(1, -1)) || [];

      parentPath = categories.join('/');
    }

    return {
      lang,
      slug,
      page,
      categories,
      parentPath,
      fullPath: pathSegments.join('/'),
      pathSegments,
    };
  }

  const state = reactive(calcParams());

  const stopWatcher = watch(
    () => route.path,
    () => {
      const newParams = calcParams();
      Object.assign(state, newParams);
    },
    { immediate: false },
  );

  tryOnScopeDispose(() => {
    stopWatcher();
  });

  return {
    ...state,
    calcParams,
  };
};
