// Registry of page blocks.
//
// Each key is the Strapi component name (the `__component` value with the
// leading `blocks.` prefix removed, e.g. `blocks.main-banner` -> `main-banner`).
//
// Each value describes how the block is rendered and, optionally, what data it
// needs to fetch:
//   - `component` (required): the file name inside `@/blocks/<component>.vue`.
//   - `request` (optional): a data request (or an array of requests) resolved
//     by `useBlocksRequest` before the block is rendered.
//
// Example:
//
// import { ARTICLE_POPULATE } from '@/configs/populates';
//
// export const BLOCKS = {
//   'text': {
//     component: 'TitleBlock',
//   },
//   'articles': {
//     component: 'Articles',
//     request: {
//       collection: 'articles',
//       pagination: {
//         pageSize: 10,
//       },
//       params: {
//         populate: ARTICLE_POPULATE,
//       },
//     },
//   },
// };

/** Block renderer/request registry keyed by Strapi component name. @example BLOCKS['hero'] */
export const BLOCKS: Record<string, Record<string, any>> = {};
