import { describe, expect, it } from 'vitest';

import { sanitizeSvg } from './sanitizeSvg';

describe('sanitizeSvg', () => {
  it('keeps SVG geometry and removes executable markup', () => {
    const svg = sanitizeSvg(
      '<svg viewBox="0 0 10 10" onload="alert(1)"><script>alert(1)</script><path d="M0 0" onclick="alert(1)" /></svg>',
    );

    expect(svg).toContain('<path d="M0 0" />');
    expect(svg).not.toMatch(/script|onload|onclick/);
  });
});
