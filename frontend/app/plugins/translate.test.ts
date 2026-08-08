import { beforeEach, describe, expect, it, vi } from 'vitest';

const translations = {
  greeting: 'Вітаємо',
  header: { contacts: 'Контакти' },
};

describe('translate plugin', () => {
  let t: (key: string) => string;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('defineNuxtPlugin', (plugin: any) => plugin);
    vi.stubGlobal('useGlobalStore', () => ({ translations }));
    const plugin = (await import('./translate')).default as any;
    t = plugin.setup().provide.t;
  });

  it('resolves flat and dot-path keys', () => {
    expect(t('greeting')).toBe('Вітаємо');
    expect(t('header.contacts')).toBe('Контакти');
  });

  it('returns the key when no translation exists', () => {
    expect(t('missing.key')).toBe('missing.key');
  });
});
