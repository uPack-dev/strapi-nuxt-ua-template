import { defineStore } from 'pinia';

export interface Locale {
  code: string;
  isDefault?: boolean;
}

interface GlobalState {
  pages: any[];
  seoData: any;
  layoutData: any;
  translations: any;
  languages: Locale[];
  redirects: any[];
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    pages: [],
    seoData: [],
    layoutData: [],
    translations: [],
    languages: [],
    redirects: [],
  }),
  actions: {
    /**
     * @param data - Lead form values.
     * @returns Created lead response.
     * @example await store.sendLead({ name: 'Іван', phone: '+380977777777' })
     */
    async sendLead(data: Record<string, unknown>) {
      return useStrapi().create('leads', data);
    },

    /**
     * @param payload - State key and replacement value.
     * @returns Nothing.
     * @example store.setState({ key: 'pages', data: [] })
     */
    setState<K extends keyof GlobalState>({
      key,
      data,
    }: {
      key: K;
      data: GlobalState[K];
    }) {
      this[key] = data;
    },

    /** Resets the store to its initial state. @returns Nothing. */
    reset() {
      this.$reset();
    },
  },
});
