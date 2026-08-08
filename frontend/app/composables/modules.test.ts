import { describe, expect, it } from 'vitest';

import { adaptedImage } from '../adapters/image';
import { adaptedMenuLinks } from '../adapters/menuLinks';
import { extractSlugFromUrl } from './useRouteParams';

describe('module contracts', () => {
  it('adapts menu links with root-relative slugs', () => {
    expect(
      adaptedMenuLinks([
        { slug: null, title: 'Home', menuItems: [] },
        {
          slug: 'services',
          title: 'Services',
          menuItems: [{ slug: 'services/power', title: 'Power' }],
        },
      ]),
    ).toEqual([
      { text: 'Home', link: '/', links: [] },
      {
        text: 'Services',
        link: '/services',
        links: [{ text: 'Power', link: '/services/power', links: [] }],
      },
    ]);
    expect(adaptedMenuLinks(undefined)).toEqual([]);
  });

  it('absolutizes strapi image urls', () => {
    expect(
      adaptedImage(
        {
          url: '/uploads/a.jpg',
          formats: { small: { url: '/uploads/s.jpg' } },
        },
        'https://server.test',
      ),
    ).toEqual({
      url: 'https://server.test/uploads/a.jpg',
      formats: { small: { url: 'https://server.test/uploads/s.jpg' } },
    });
    expect(adaptedImage(null, 'https://server.test')).toBeNull();
    expect(adaptedImage({}, 'https://server.test')).toBeNull();
  });

  it('extracts the final URL segment', () => {
    expect(extractSlugFromUrl('/en/news/item/?page=2#top')).toBe('item');
    expect(extractSlugFromUrl('')).toBe('');
  });
});
