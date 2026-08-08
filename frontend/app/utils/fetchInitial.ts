import { SEO_POPULATE } from '@/configs/populates';

interface InitialResponse<T> {
  data: T;
}

/**
 * Fetches localized initial SEO data from Strapi.
 *
 * Uses the server URL during SSR and the client URL in the browser. Request
 * failures resolve to `undefined`, preserving existing callers.
 * @param locale - Strapi locale code. Defaults to `en`.
 * @returns Initial response data, or `undefined` after a request failure.
 * @example await fetchInitial('en')
 */
export async function fetchInitial<T = unknown>(
  locale = 'en',
): Promise<T | undefined> {
  const config = useRuntimeConfig();
  const strapiUrl = process.server
    ? config.public.serverUrl
    : config.public.clientUrl;
  const query = new URLSearchParams();

  SEO_POPULATE.forEach((populate, index) => {
    query.append(`populate[${index}]`, populate);
  });
  query.append('locale', locale);

  try {
    const response = await $fetch<InitialResponse<T>>(
      `${strapiUrl}/api/initial?${query.toString()}`,
    );
    return response.data;
  } catch (error) {
    if (config.public.isDev) console.error(error);
  }
}
