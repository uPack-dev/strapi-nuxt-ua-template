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

/**
 * Expands reusable groups in place without mutating the CMS response.
 * @param blocks - Direct blocks and reusable group references.
 * @returns Every group child in its original order; empty groups are skipped.
 * @example expandBlocks([{ __component: 'blocks.reusable', block: { global: [] } }]) // []
 */
export const expandBlocks = (blocks: Array<Record<string, any>> = []) =>
  (Array.isArray(blocks) ? blocks : []).flatMap((block) =>
    block.__component === 'blocks.reusable'
      ? block.block?.global || []
      : [block],
  );
