import { LAYOUT_POPULATE, SEO_POPULATE } from '@/configs/populates';
import { useGlobalStore } from '@/stores/global';
import { getRouteLocale } from '@/utils/locale';
import { isEmptyStrapiResponse } from '@/utils/strapiData';

/**
 * Make initial requests for common data
 * @description Renamed from 'initial-data.server.js' due to plugin not start in pages with routeRules: 'ssr: false'
 * @description Check for flag in stores to avoid unnecessary requests on client e.g. 'isFetched'
 * @example
 * if (!store.data.isFetched) {
 *   requests.push(store.fetchData());
 * }
 * @returns Server plugin that fills the global store from Strapi.
 */
export default defineNuxtPlugin({
  name: 'initialData',
  parallel: true,
  async setup() {
    const { find } = useStrapi<any>();
    const globalStore = useGlobalStore();
    // locales go first: the active locale for the other requests
    // is derived from the URL prefix against this list
    const languages = await find('i18n/locales').catch(() => undefined);
    const locales = Array.isArray(languages) ? languages : [];
    const locale = getRouteLocale(useRequestURL().pathname, locales);
    // content not yet translated to `locale` falls back to the default locale
    const findLocalized = (
      contentType: string,
      params: Record<string, any> = {},
    ) =>
      find(contentType, { ...params, locale } as any).then(
        (response: any) =>
          isEmptyStrapiResponse(response)
            ? find(contentType, params as any)
            : response,
        () => find(contentType, params as any),
      );
    const [layoutData, pages, global, translations] = await Promise.allSettled([
      findLocalized('layout', {
        populate: LAYOUT_POPULATE,
      }),
      findLocalized('pages', {}),
      findLocalized('initial', {
        populate: [...SEO_POPULATE, 'redirects'],
      }),
      findLocalized('translation', {}),
    ]);
    const value = (result: PromiseSettledResult<any>) =>
      result.status === 'fulfilled' ? result.value : undefined;
    globalStore.setState({
      key: 'layoutData',
      data: value(layoutData)?.data || {},
    });
    globalStore.setState({
      key: 'pages',
      data: value(pages)?.data || {},
    });
    globalStore.setState({
      key: 'seoData',
      data: value(global)?.data?.seo || {},
    });
    globalStore.setState({
      key: 'translations',
      data: value(translations)?.data || {},
    });
    globalStore.setState({
      key: 'redirects',
      data: value(global)?.data?.redirects || [],
    });
    globalStore.setState({
      key: 'languages',
      data: languages || ({} as any),
    });
  },
});
