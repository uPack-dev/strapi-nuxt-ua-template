import sanitize from 'ultrahtml/transformers/sanitize';
import {
  transformSync,
  walkSync,
  type Node,
  type TransformerSync,
} from 'ultrahtml';

const SVG_ELEMENTS = [
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'g',
  'line',
  'linearGradient',
  'mask',
  'path',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'title',
];

const SVG_ATTRIBUTES = new Set([
  'clip-path',
  'clip-rule',
  'cx',
  'cy',
  'd',
  'fill',
  'fill-rule',
  'height',
  'id',
  'mask',
  'offset',
  'opacity',
  'points',
  'preserveAspectRatio',
  'r',
  'rx',
  'ry',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-width',
  'transform',
  'viewBox',
  'width',
  'x',
  'x1',
  'x2',
  'xmlns',
  'y',
  'y1',
  'y2',
]);

const sanitizeAttributes: TransformerSync = (document: Node) => {
  walkSync(document, (node) => {
    if (!('attributes' in node)) return;

    node.attributes = Object.fromEntries(
      Object.entries(node.attributes).filter(([attribute]) =>
        SVG_ATTRIBUTES.has(attribute),
      ),
    );
  });

  return document;
};

/**
 * Sanitizes CMS-provided inline SVG markup using a strict element and attribute allowlist.
 * @param svg - Raw SVG markup.
 * @returns Safe inline SVG markup.
 * @example sanitizeSvg('<svg onload="alert(1)"><path d="M0 0" /></svg>')
 */
export const sanitizeSvg = (svg: string): string =>
  svg.trim()
    ? transformSync(svg, [
        sanitize({ allowElements: SVG_ELEMENTS }),
        sanitizeAttributes,
      ])
    : '';
