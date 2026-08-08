import { beforeEach, describe, expect, it, vi } from 'vitest';

const rules = new Map<string, (...args: any[]) => any>();

vi.mock('vee-validate', () => ({
  configure: vi.fn(),
  defineRule: (name: string, rule: (...args: any[]) => any) =>
    rules.set(name, rule),
}));

describe('validator plugin', () => {
  beforeEach(() => {
    rules.clear();
    vi.resetModules();
    vi.stubGlobal('defineNuxtPlugin', (plugin: unknown) => plugin);
    vi.stubGlobal('useState', (_key: string, factory: () => unknown) => ({
      value: factory(),
    }));
  });

  it('registers required and email behavior', async () => {
    const plugin = (await import('./validator')).default as unknown as (app: {
      provide: () => void;
    }) => void;
    plugin({ provide: vi.fn() });

    expect(rules.get('required')?.('')).toBe('Це поле обовʼязкове');
    expect(rules.get('required')?.('value')).toBe(true);
    expect(rules.get('email')?.('invalid')).toBe(
      'Введіть коректну адресу електронної пошти',
    );
    expect(rules.get('email')?.('mail@example.com')).toBe(true);
  });
});
