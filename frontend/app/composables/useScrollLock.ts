/**
 * Scroll lock integration
 * @description Locks page scroll via the OverlayScrollbars instance (see
 * plugins/overlayscrollbars.client.ts). OverlayScrollbars owns the page
 * scroller, so a plain body overflow lock has no effect — hence its own API.
 * @returns {{lock: function, unlock: function}} scroll lock methods object
 * @example
 * const scrollLock = useScrollLock();
 * scrollLock.lock();
 */
export const useScrollLock = () => {
  const { $pageScrollLock } = useNuxtApp();

  return {
    lock: () => $pageScrollLock?.lock(),
    unlock: () => $pageScrollLock?.unlock(),
  };
};
