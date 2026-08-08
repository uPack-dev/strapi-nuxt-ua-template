/** Font file family and weights used to build preload links. */
export interface FontSource {
  path: string;
  weights: number[];
}

/** Browser preload descriptor for a WOFF2 font. */
export interface FontPreload {
  rel: 'preload';
  href: string;
  as: 'font';
  type: 'font/woff2';
  crossorigin: true;
}

/**
 * Clones a JSON-compatible value through JSON serialization.
 * @param object - JSON-compatible value.
 * @returns An independent value with the same type.
 * @example cloneObject({ value: 1 }) // { value: 1 }
 */
export function cloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object)) as T;
}

/**
 * @param duration - Delay in milliseconds. Defaults to `0`.
 * @returns A promise resolving without a value after the delay.
 * @example await awaitTimeout(100)
 */
export function awaitTimeout(duration = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * @param source - Font path prefix and weights.
 * @param baseUrl - Prefix before `fonts/`. Defaults to `/`.
 * @returns One WOFF2 preload descriptor per weight.
 * @example getFontPreloadList({ path: 'Inter-', weights: [400] })
 */
export function getFontPreloadList(
  { path, weights }: FontSource,
  baseUrl = '/',
): FontPreload[] {
  return weights.map((weight) => ({
    rel: 'preload',
    href: `${baseUrl}fonts/${path}${weight}.woff2`,
    as: 'font',
    type: 'font/woff2',
    crossorigin: true,
  }));
}

/**
 * @param fontsList - Font families and weights.
 * @param baseUrl - Prefix before `fonts/`. Defaults to `/`.
 * @returns A flat array of preload descriptors.
 * @example getFontsPreloadList([{ path: 'Inter-', weights: [400] }])
 */
export function getFontsPreloadList(
  fontsList: FontSource[],
  baseUrl = '/',
): FontPreload[] {
  return fontsList.flatMap((font) => getFontPreloadList(font, baseUrl));
}

/**
 * @param a - First value.
 * @param b - Second value.
 * @returns Whether nested enumerable data is equal.
 * @example isDeepEqual({ a: [1] }, { a: [1] }) // true
 */
export function isDeepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }

  const objectA = a as Record<string, unknown>;
  const objectB = b as Record<string, unknown>;
  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) =>
      Object.hasOwn(objectB, key) && isDeepEqual(objectA[key], objectB[key]),
  );
}
