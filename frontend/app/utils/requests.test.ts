import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchInitial } from './fetchInitial';
import generateSitemapRoutes from './sitemapRoutes';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  process.server = false;
});

describe('fetchInitial', () => {
  it.each([
    [true, 'https://server.test'],
    [false, 'https://client.test'],
  ])('uses the configured URL for server=%s', async (server, baseUrl) => {
    process.server = server;
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        serverUrl: 'https://server.test',
        clientUrl: 'https://client.test',
      },
    }));
    const request = vi.fn().mockResolvedValue({ data: { title: 'Initial' } });
    vi.stubGlobal('$fetch', request);

    await expect(fetchInitial()).resolves.toEqual({ title: 'Initial' });
    expect(request).toHaveBeenCalledWith(
      `${baseUrl}/api/initial?populate%5B0%5D=seo.favicon&populate%5B1%5D=seo.ogImage&populate%5B2%5D=seo.schema&locale=en`,
    );
  });

  it('logs request failures in development and returns undefined', async () => {
    process.server = true;
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { isDev: true, serverUrl: 'https://server.test' },
    }));
    vi.stubGlobal('$fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(fetchInitial('uk')).resolves.toBeUndefined();
    expect(error).toHaveBeenCalledOnce();
  });
});

describe('generateSitemapRoutes', () => {
  it('maps default and translated pages to sitemap routes', async () => {
    const request = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.endsWith('/api/i18n/locales')) {
        return Response.json([
          { code: 'en', isDefault: true },
          { code: 'uk', isDefault: false },
        ]);
      }
      if (url.includes('locale=en')) {
        return Response.json({
          data: [
            { slug: 'main', updatedAt: '2025-01-02T12:00:00Z' },
            { slug: 'about', updatedAt: '2025-02-03T12:00:00Z' },
          ],
        });
      }
      return Response.json({
        data: [{ slug: 'about', updatedAt: '2025-03-04T12:00:00Z' }],
      });
    });
    vi.stubGlobal('fetch', request);

    await expect(generateSitemapRoutes('https://strapi.test')).resolves.toEqual(
      [
        { loc: '', lastmod: '2025-01-02T12:00:00Z' },
        { loc: '/about', lastmod: '2025-02-03T12:00:00Z' },
        { loc: '/uk/about', lastmod: '2025-03-04T12:00:00Z' },
      ],
    );
  });

  it('keeps fulfilled locale routes when another locale fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input);
        if (url.endsWith('/api/i18n/locales')) {
          return Response.json([
            { code: 'en', isDefault: true },
            { code: 'uk', isDefault: false },
          ]);
        }
        if (url.includes('locale=uk')) throw new Error('offline');
        return Response.json({
          data: [{ slug: 'about', updatedAt: '2025-02-03' }],
        });
      }),
    );

    await expect(generateSitemapRoutes('https://strapi.test')).resolves.toEqual(
      [{ loc: '/about', lastmod: '2025-02-03' }],
    );
  });
});
