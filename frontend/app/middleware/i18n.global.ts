import { defineNuxtRouteMiddleware, navigateTo } from '#imports';

/**
 * @returns Route middleware keeping the default locale prefix-less.
 * @example // `/en/about` redirects to `/about`; `/ru/about` stays.
 */
export default defineNuxtRouteMiddleware((to) => {
  const globalStore = useGlobalStore();
  // locales fetch can fail → store holds `{}` instead of an array
  const locales = Array.isArray(globalStore.languages)
    ? globalStore.languages
    : [];
  const defaultLang = locales.find((locale) => locale.isDefault)?.code;

  if (!defaultLang) return;

  const segments = to.path.split('/').filter(Boolean);

  // default locale is prefix-less; strip its prefix if present
  if (segments[0] === defaultLang) {
    return navigateTo(`/${segments.slice(1).join('/')}`);
  }
  // unknown first segments (incl. 2-char slugs like /it) fall through:
  // the catch-all page 404s naturally if Strapi has no such page
});
