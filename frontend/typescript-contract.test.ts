import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const directories = [
  'app/plugins',
  'app/middleware',
  'app/adapters',
  'app/configs',
  'app/stores',
  'app/composables',
];

describe('TypeScript migration contract', () => {
  it.each(directories)('%s contains no JavaScript modules', (directory) => {
    expect(
      readdirSync(directory).filter((file) => file.endsWith('.js')),
    ).toEqual([]);
  });

  it('documents every exported callable with an output contract', () => {
    for (const directory of directories) {
      for (const file of readdirSync(directory).filter(
        (name) => name.endsWith('.ts') && !name.includes('.test.'),
      )) {
        const source = readFileSync(join(directory, file), 'utf8');
        if (
          /defineNuxtPlugin|defineNuxtRouteMiddleware|export const (?:use|adapted)|export function/.test(
            source,
          )
        ) {
          expect(source, `${directory}/${file}`).toContain('@returns');
        }
      }
    }
  });
});
