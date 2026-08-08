import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  accentToHtml,
  awaitRAF,
  awaitTimeout,
  buildSrcset,
  cleanPhone,
  cloneObject,
  formatBytes,
  formatDate,
  formatNumberAbbr,
  formatPrice,
  formatToQuarter,
  getElementFz,
  getFontPreloadList,
  getFontsPreloadList,
  isDeepEqual,
  minMax,
  parseNumberAbbr,
  preloadImage,
  preloadImages,
  round,
  slugFromString,
  toResizedEm,
  toResizedPx,
} from './helpers';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('common and number helpers', () => {
  it('preserves current values and formatting', () => {
    expect(minMax(15, 5, 10)).toBe(10);
    expect(cloneObject({ nested: { value: 1 } })).toEqual({
      nested: { value: 1 },
    });
    expect(round(1.235, 2)).toBe(1.24);
    expect(formatNumberAbbr('1 250 000')).toBe('1.3M');
    expect(formatNumberAbbr(0.125)).toBe(0.13);
    expect(parseNumberAbbr('3,2M')).toBe(3_200_000);
    expect(parseNumberAbbr('1.2.3')).toBe(1.2);
    expect(formatPrice('1002003.45')).toBe('1,002,003.45');
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('waits for the configured timeout', async () => {
    vi.useFakeTimers();
    const promise = awaitTimeout(20);
    await vi.advanceTimersByTimeAsync(20);
    await expect(promise).resolves.toBeUndefined();
  });

  it('builds font preload descriptors', () => {
    expect(
      getFontPreloadList({ path: 'Inter-', weights: [400] }, '/assets/'),
    ).toEqual([
      {
        rel: 'preload',
        href: '/assets/fonts/Inter-400.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true,
      },
    ]);
    expect(
      getFontsPreloadList([
        { path: 'Inter-', weights: [400] },
        { path: 'Roboto-', weights: [700] },
      ]),
    ).toHaveLength(2);
  });

  it('compares nested values', () => {
    expect(isDeepEqual({ a: [1] }, { a: [1] })).toBe(true);
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
});

describe('format helpers', () => {
  it('preserves date and string formats', () => {
    expect(formatToQuarter('2025-07-23')).toBe('Q3 2025');
    expect(formatDate('2025-07-11T12:57:48.426Z')).toMatch(/^11\.07\.2025$/);
    expect(slugFromString('Hello World')).toBe('hello_world');
    expect(cleanPhone('+38 050 123')).toBe('+38050123');
    expect(accentToHtml('<accent>A</accent> b')).toBe(
      '<span class="accent">A</span> b',
    );
  });

  it('builds srcset in requested order', () => {
    const image = {
      url: '/main.png',
      width: 800,
      formats: {
        large: { url: '/large.png', width: 1600 },
        small: { url: '/small.png', width: 400 },
      },
    };

    expect(buildSrcset(image, 'url', ['large', 'small'])).toBe(
      '/main.png 800w, /large.png 1600w, /small.png 400w',
    );
    expect(buildSrcset(undefined)).toBe('');
  });
});

describe('DOM helpers', () => {
  it('uses computed font size for resized units', () => {
    const body = {} as HTMLElement;
    vi.stubGlobal('document', { body, querySelector: vi.fn(() => body) });
    vi.stubGlobal('window', {
      getComputedStyle: vi.fn(() => ({ fontSize: '20px' })),
    });

    expect(getElementFz('body')).toBe(20);
    expect(toResizedPx(16, body)).toBe(20);
    expect(toResizedEm(24)).toBe(1.5);
  });

  it('resolves on the next animation frame', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });

    await expect(awaitRAF()).resolves.toBe(0);
  });

  it.each(['load', 'error'])('resolves image preload on %s', async (event) => {
    class ImageStub {
      src = '';
      addEventListener(name: string, callback: () => void) {
        if (name === event) queueMicrotask(callback);
      }
    }
    vi.stubGlobal('Image', ImageStub);

    await expect(preloadImage('/image.png')).resolves.toBeUndefined();
    await expect(preloadImages(['/one.png', '/two.png'])).resolves.toHaveLength(
      2,
    );
  });
});
