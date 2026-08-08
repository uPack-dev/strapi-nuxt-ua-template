/**
 * @param value - Number to constrain.
 * @param min - Inclusive minimum.
 * @param max - Inclusive maximum.
 * @returns Constrained number.
 * @example minMax(15, 5, 10) // 10
 */
export function minMax(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param value - Number to round.
 * @param digits - Decimal places. Defaults to `0`.
 * @returns Rounded number.
 * @example round(1.235, 2) // 1.24
 */
export function round(value: number, digits = 0): number {
  const power = 10 ** digits;
  return Math.round(value * power) / power;
}

/**
 * @param value - Number or numeric string.
 * @returns Comma-grouped numeric string.
 * @example formatPrice('1002003.45') // '1,002,003.45'
 */
export function formatPrice(value: number | string): string {
  let stringValue =
    typeof value === 'number' ? String(value) : value.replace(/\s+/g, '');
  const sign = stringValue.startsWith('-') ? '-' : '';
  if (sign) stringValue = stringValue.slice(1);

  const [integer = '', fraction] = stringValue.split('.');
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + formatted + (fraction !== undefined ? `.${fraction}` : '');
}

/**
 * Formats millions and billions with a suffix and other values using the
 * utility's existing price/rounding rules.
 * @param input - Number or numeric string with optional spaces.
 * @param decimals - Suffix precision. Defaults to `1`.
 * @returns Formatted string; zero and sub-unit values remain numbers.
 * @example formatNumberAbbr('1250000') // '1.3M'
 */
export function formatNumberAbbr(
  input: number | string,
  decimals = 1,
): number | string {
  const number =
    typeof input === 'string' ? parseFloat(input.replace(/\s+/g, '')) : input;
  const absolute = Math.abs(number);
  const sign = number < 0 ? '-' : '';

  const format = (divisor: number, suffix: string) =>
    sign + parseFloat((number / divisor).toFixed(decimals)).toString() + suffix;

  if (absolute >= 1e9) return format(1e9, 'B');
  if (absolute >= 1e6) return format(1e6, 'M');
  if (absolute >= 1e3) return formatPrice(number.toFixed(0));
  if (absolute < 1) return Math.round(number * 100) / 100;
  return number ? String(number.toFixed(0)) : number;
}

/**
 * @param value - Human-readable abbreviated number.
 * @returns Parsed number, or `0` when parsing fails.
 * @example parseNumberAbbr('3,2M') // 3200000
 */
export function parseNumberAbbr(value: string): number {
  if (typeof value !== 'string') return 0;

  let cleaned = value.trim().replace(/\s+/g, '');
  const abbreviation = cleaned.match(/([kmb])$/i)?.[1]?.toLowerCase();
  const multiplier =
    abbreviation === 'k'
      ? 1e3
      : abbreviation === 'm'
        ? 1e6
        : abbreviation === 'b'
          ? 1e9
          : 1;
  if (abbreviation) cleaned = cleaned.slice(0, -1);
  if (!/\d/.test(cleaned)) return 0;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator =
      Math.max(lastComma, lastDot) === lastComma ? ',' : '.';
    const thousandSeparator = decimalSeparator === ',' ? '.' : ',';
    cleaned = cleaned.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '');
    cleaned = cleaned.replace(decimalSeparator, '.');
  } else if (lastComma !== -1) {
    const afterComma = cleaned.slice(lastComma + 1);
    cleaned =
      afterComma.length <= 2 && /^\d{1,3}$/.test(afterComma)
        ? cleaned.replace(',', '.')
        : cleaned.replace(/,/g, '');
  } else if (lastDot !== -1 && cleaned.indexOf('.', lastDot + 1) !== -1) {
    cleaned = cleaned.replace(/\./g, '');
  }

  const number = parseFloat(cleaned);
  return Number.isNaN(number) ? 0 : number * multiplier;
}

/**
 * @param bytes - Byte count.
 * @param decimals - Precision; falsy values use `2`.
 * @returns Value followed by its binary unit.
 * @example formatBytes(1024) // '1 KB'
 */
export function formatBytes(bytes: number, decimals?: number): string {
  if (bytes === 0) return '0 Bytes';

  const base = 1024;
  const precision = decimals || 2;
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const unit = Math.floor(Math.log(bytes) / Math.log(base));
  return `${parseFloat((bytes / base ** unit).toFixed(precision))} ${units[unit]}`;
}
