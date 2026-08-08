/**
 * Базовые пути populate для страниц.
 * Добавляются ко всем типам страниц.
 * @type {string[]}
 */
export const BASE_POPULATE: string[] = [
  'blocks.image.desktop',
  'blocks.image.tablet',
  'blocks.image.mobile',
  'blocks.buttons',
  'blocks.items.image',
  'blocks.items.image.desktop',
  'blocks.items.image.tablet',
  'blocks.items.image.mobile',
  'blocks.items.link',
  'blocks.items.items',
  'blocks.button',
  'blocks.contacts',
  'blocks.socials',
  'blocks.sectionData',
];

/**
 * Дополнительные пути populate для типов `pages`.
 * @type {string[]}
 */
export const PAGES_POPULATE: string[] = ['blocks.links'];

/**
 * Карта populate по имени коллекции (`<collection>-item`).
 * @type {Record<string, string[]>}
 */
export const PAGE_POPULATE: Record<string, string[]> = {};

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
