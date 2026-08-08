import Typograf from 'typograf';

/**
 * Typograf integration
 * @description Fix word wraps and other common typos
 * @returns Nuxt plugin providing `tp(text)`.
 * @example const text = useNuxtApp().$tp('Text')
 */
export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const typograf = new Typograf({ locale: ['ru', 'en-US'] });

    return {
      provide: {
        tp: (text: string) => typograf.execute(text),
      },
    };
  },
});
