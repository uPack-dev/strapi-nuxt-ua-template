interface StrapiResponse {
  data?: unknown;
}

/**
 * Checks whether a Strapi response contains no collection or single-type data.
 * @param response - Strapi response.
 * @returns Whether the response data is absent or an empty array.
 * @example isEmptyStrapiResponse({ data: null }) // true
 */
export const isEmptyStrapiResponse = (
  response: StrapiResponse | null | undefined,
): boolean =>
  response?.data == null ||
  (Array.isArray(response.data) && !response.data.length);
