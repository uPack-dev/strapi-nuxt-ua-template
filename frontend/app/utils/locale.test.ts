import { describe, expect, it } from 'vitest';

import { getRouteLocale, stripRouteLocale } from './locale';
import { isEmptyStrapiResponse } from './strapiData';

describe('localized data helpers', () => {
  it('keeps two-letter page slugs that are not configured locales', () => {
    const locales = [{ code: 'uk', isDefault: true }, { code: 'en' }];

    expect(getRouteLocale('/en/catalog', locales)).toBe('en');
    expect(getRouteLocale('/it/catalog', locales)).toBe('uk');
    expect(stripRouteLocale('/en/catalog', locales)).toBe('/catalog');
    expect(stripRouteLocale('/it/catalog', locales)).toBe('/it/catalog');
  });

  it('detects empty strapi collections and single types', () => {
    expect(isEmptyStrapiResponse({ data: null })).toBe(true);
    expect(isEmptyStrapiResponse({ data: [] })).toBe(true);
    expect(isEmptyStrapiResponse({ data: {} })).toBe(false);
  });
});
