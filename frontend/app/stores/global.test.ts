import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGlobalStore } from './global';

describe('global store', () => {
  beforeEach(() => setActivePinia(createPinia()));
  afterEach(() => vi.unstubAllGlobals());

  it('sends leads to the public lead endpoint', async () => {
    const create = vi.fn().mockResolvedValue({ data: { id: 1 } });
    vi.stubGlobal('useStrapi', () => ({ create }));
    const data = { name: 'Іван', phone: '+380977777777' };

    await useGlobalStore().sendLead(data);

    expect(create).toHaveBeenCalledWith('leads', data);
  });

  it('sets a selected state field and resets all state', () => {
    const store = useGlobalStore();
    store.setState({ key: 'pages', data: [{ slug: 'about' }] });
    expect(store.pages).toEqual([{ slug: 'about' }]);

    store.reset();
    expect(store.pages).toEqual([]);
  });
});
