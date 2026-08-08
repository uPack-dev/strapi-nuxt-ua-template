export interface MenuLink {
  slug?: string | null;
  title: string;
  menuItems?: MenuLink[];
}

export interface AdaptedMenuLink {
  text: string;
  link: string;
  links: AdaptedMenuLink[];
}

/**
 * Converts a single menu item into the format expected by navigation components.
 * Slugs come from Strapi already root-relative (`catalog/cables`), so the link
 * is simply `/${slug}`; a `null`/empty slug maps to the homepage `/`.
 * @param {Object} link - Raw menu link object (from CMS).
 * @param {string|null} [link.slug] - Root-relative URL slug of the item.
 * @param {string} link.title - Display text of the item.
 * @param {Array} [link.menuItems] - Nested child menu items.
 * @returns {{ text: string, link: string, links: Array }} Adapted menu item.
 */
const adaptMenuLink = (link: MenuLink): AdaptedMenuLink => ({
  text: link.title,
  link: `/${link.slug ?? ''}`,
  links: adaptedMenuLinks(link.menuItems),
});

/**
 * Recursively adapts an array of menu items.
 *
 * @param {Array<Object>} links - Array of raw menu items.
 * @returns {Array<{ text: string, link: string, links: Array }>} Array of adapted menu items.
 */
export const adaptedMenuLinks = (links?: MenuLink[]): AdaptedMenuLink[] => {
  if (!links?.length) return [];

  return links.map(adaptMenuLink);
};
