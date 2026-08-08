/**
 * Vue Final Modal integration
 * @example
 * const modal = useModal({
 *   component: resolveComponent('LazyModalComponent')
 * });
 * onMounted(() => modal.open());
 * @returns Client plugin installing Vue Final Modal.
 * @see https://vue-final-modal.org/
 */
export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxtApp) {
    await import('vue-final-modal/style.css');
    const { createVfm } = await import('vue-final-modal');

    const vfm = createVfm();
    nuxtApp.vueApp.use(vfm);

    // OverlayScrollbars owns the page scroller, so vfm's built-in body lock
    // has no effect — lock through its API while any modal is open.
    watch(
      () => vfm.openedModals.length,
      (count) => {
        const scrollLock = nuxtApp.$pageScrollLock;
        if (count) scrollLock?.lock();
        else scrollLock?.unlock();
      },
    );
  },
});
