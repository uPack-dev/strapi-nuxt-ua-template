/** Minimal responsive-image shape consumed by {@link buildSrcset}. */
export interface ImageSource {
  url?: string;
  width?: number;
  formats?: Record<string, ImageSource | undefined>;
  [key: string]: unknown;
}

/**
 * @param isoDate - YYYY-MM-DD-like value.
 * @returns Quarter/year label, or `''` for empty input.
 * @example formatToQuarter('2025-07-23') // 'Q3 2025'
 */
export function formatToQuarter(isoDate = ''): string {
  if (!isoDate) return '';
  const [year = 0, month = 0] = isoDate.split('-').map(Number);
  return `Q${Math.floor((month - 1) / 3) + 1} ${year}`;
}

/**
 * @param dateString - Value accepted by `Date`.
 * @returns Local date as `DD.MM.YYYY`, or `''` for empty input.
 * @example formatDate('2025-07-11') // '11.07.2025'
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

/**
 * @param name - Source string.
 * @returns Lowercase string with spaces replaced by underscores.
 * @example slugFromString('Hello World') // 'hello_world'
 */
export function slugFromString(name: string): string {
  return name.toLowerCase().split(' ').join('_');
}

/**
 * @param phone - Phone string containing optional whitespace.
 * @returns Phone string without whitespace.
 * @example cleanPhone('+38 050') // '+38050'
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\s/g, '');
}

/**
 * @param text - String with CMS `<accent>` markers.
 * @returns HTML where markers become `<span class="accent">`.
 * @example accentToHtml('<accent>A</accent> b') // '<span class="accent">A</span> b'
 */
export function accentToHtml(text: string): string {
  return text
    .replaceAll('<accent>', '<span class="accent">')
    .replaceAll('</accent>', '</span>');
}

/**
 * @param object - Main image and responsive formats.
 * @param mainKey - Main URL property. Defaults to `url`.
 * @param formatKeys - Format name or ordered names to include.
 * @returns Comma-separated srcset, or `''` without an image.
 * @example buildSrcset({ url: '/a.webp', width: 800 }) // '/a.webp 800w'
 */
export function buildSrcset(
  object?: ImageSource | null,
  mainKey = 'url',
  formatKeys: string[] | string = [],
): string {
  if (!object) return '';
  const sources: string[] = [];

  if (object[mainKey] && object.width) {
    sources.push(`${object[mainKey]} ${object.width}w`);
  }

  const keys = Array.isArray(formatKeys) ? formatKeys : [formatKeys];
  for (const key of keys) {
    const format = object.formats?.[key];
    if (format?.url && format.width)
      sources.push(`${format.url} ${format.width}w`);
  }

  return sources.join(', ');
}
