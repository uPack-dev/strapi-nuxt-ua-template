type Populate = Record<string, unknown>;

/**
 * Фрагменты dynamic zone по UID компонента. Новый блок добавляется сюда
 * вместе со схемой и получает тот же populate внутри многоразовых групп.
 * @type {Record<string, Populate>}
 */
export const BLOCK_FRAGMENTS: Record<string, Populate> = {
  'blocks.template-block': { populate: { sectionData: true } },
};

/** Populate страниц с раскрытием всех блоков многоразовой группы. */
export const BLOCKS_POPULATE: Populate = {
  blocks: {
    on: {
      ...BLOCK_FRAGMENTS,
      'blocks.reusable': {
        populate: { block: { populate: { global: { on: BLOCK_FRAGMENTS } } } },
      },
    },
  },
};

/**
 * Карта populate по имени коллекции (`<collection>-item`).
 * @type {Record<string, Populate>}
 */
export const PAGE_POPULATE: Record<string, Populate> = {};

/**
 * Populate для SEO-данных страницы. Включается во все запросы страниц.
 * @type {string[]}
 */
export const SEO_POPULATE: string[] = [
  'seo.favicon',
  'seo.ogImage',
  'seo.schema',
];

/**
 * Populate для layout-данных (header и footer).
 * @type {string[]}
 */
export const LAYOUT_POPULATE: string[] = [
  'header.links.menuItems',
  'header.socials',
  'header.contacts',
  'header.download',
  'header.image',
  'footer.links.menuItems',
  'footer.socials',
  'footer.contacts',
  'footer.download',
  'footer.developer.image',
];
