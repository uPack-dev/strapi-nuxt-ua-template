/**
 * Translations from the global store
 * @description Looks up a key (dot-path supported) in globalStore.translations
 * @returns Nuxt plugin providing `t(key, fallback?)`; returns the fallback (or the
 * key itself) when no translation exists.
 * @example const text = useNuxtApp().$t('header.contacts', 'Контакти')
 */
export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const globalStore = useGlobalStore();

    return {
      provide: {
        t: (key: string, fallback?: string): string =>
          key
            .split('.')
            .reduce((obj, part) => obj?.[part], globalStore.translations) ??
          fallback ??
          key,
      },
    };
  },
});
