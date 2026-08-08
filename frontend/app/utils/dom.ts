/**
 * @returns The next frame's high-resolution timestamp.
 * @example const timestamp = await awaitRAF()
 */
export function awaitRAF(): Promise<DOMHighResTimeStamp> {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * @param element - Element or selector. Defaults to `document.body`.
 * @returns Computed font size in pixels, or `0` when absent.
 * @example getElementFz('body') // 16
 */
export function getElementFz(
  element: HTMLElement | string = document.body,
): number {
  const resolved =
    typeof element === 'string'
      ? document.querySelector<HTMLElement>(element)
      : element;
  return resolved ? parseFloat(window.getComputedStyle(resolved).fontSize) : 0;
}

/**
 * @param pxValue - Value designed for a 16px base.
 * @param contextElement - Element or selector. Defaults to `document.body`.
 * @returns Value scaled by the computed font size.
 * @example toResizedPx(16, document.body) // 20 at 20px font-size
 */
export function toResizedPx(
  pxValue: number,
  contextElement: HTMLElement | string = document.body,
): number {
  return (pxValue / 16) * getElementFz(contextElement);
}

/**
 * @param pxValue - Pixel value.
 * @param pxContext - Pixels per em. Defaults to `16`.
 * @returns Equivalent em value.
 * @example toResizedEm(24) // 1.5
 */
export function toResizedEm(pxValue: number, pxContext = 16): number {
  return pxValue / pxContext;
}

/**
 * @param url - Image URL.
 * @returns The emitted `load` or `error` event.
 * @example await preloadImage('/hero.webp')
 */
export function preloadImage(url: string): Promise<Event> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.addEventListener('load', resolve);
    image.addEventListener('error', resolve);
  });
}

/**
 * @param imageUrls - Image URLs. Defaults to `[]`.
 * @returns Events in input order after every image settles.
 * @example await preloadImages(['/one.webp', '/two.webp'])
 */
export function preloadImages(imageUrls: string[] = []): Promise<Event[]> {
  return Promise.all(Array.from(imageUrls).map(preloadImage));
}
