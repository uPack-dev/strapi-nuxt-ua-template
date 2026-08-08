import { OverlayScrollbars } from 'overlayscrollbars';
import type {
  OverlayScrollbars as OverlayScrollbarsInstance,
  PartialOptions,
} from 'overlayscrollbars';

const OVERLAY_SCROLLBAR_OPTIONS: PartialOptions = {
  scrollbars: {
    theme: 'os-theme-app',
    visibility: 'auto',
    autoHide: 'leave',
    autoHideDelay: 600,
    dragScroll: true,
    clickScroll: false,
  },
  overflow: {
    x: 'scroll',
    y: 'scroll',
  },
} as const;

/** @returns Nuxt plugin that initializes and controls the page scrollbar. */
export default defineNuxtPlugin({
  parallel: true,
  setup(nuxtApp) {
    let instance: OverlayScrollbarsInstance | undefined;

    nuxtApp.hook('app:mounted', () => {
      instance = OverlayScrollbars(document.body, OVERLAY_SCROLLBAR_OPTIONS);
    });

    // OverlayScrollbars owns the page scroller (moves it to <html>), so a plain
    // body overflow:hidden lock no longer works — toggle scroll via its own API.
    // Overlay scrollbars take no layout width, so locking causes no content shift.
    return {
      provide: {
        pageScrollLock: {
          lock: () => instance?.options({ overflow: { y: 'hidden' } }),
          unlock: () => instance?.options({ overflow: { y: 'scroll' } }),
        },
      },
    };
  },
});
