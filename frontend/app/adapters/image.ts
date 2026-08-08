export interface StrapiImage {
  url?: string;
  formats?: Record<string, StrapiImage | undefined>;
  [key: string]: unknown;
}

/**
 * Resolves relative Strapi media URLs (`/uploads/...`) against the server URL
 * so `CImage` gets absolute `src`/`srcset` values.
 *
 * @param {Object|null} [image] - Raw Strapi media object.
 * @param {string} baseUrl - Strapi server URL.
 * @returns {Object|null} Image with absolute URLs, or `null` when empty.
 * @example adaptedImage({ url: '/uploads/a.jpg' }, 'https://cms.site') // { url: 'https://cms.site/uploads/a.jpg' }
 */
export const adaptedImage = (
  image: StrapiImage | null | undefined,
  baseUrl: string,
): StrapiImage | null => {
  if (!image?.url) return null;

  const absolute = (url: string) => new URL(url, baseUrl).toString();

  return {
    ...image,
    url: absolute(image.url),
    formats:
      image.formats &&
      Object.fromEntries(
        Object.entries(image.formats).map(([key, format]) => [
          key,
          format?.url ? { ...format, url: absolute(format.url) } : format,
        ]),
      ),
  };
};
