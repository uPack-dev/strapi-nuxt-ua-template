/**
 * @returns Async Nuxt plugin providing GSAP, ScrollTrigger, and ScrollSmoother.
 * @example const { $gsap } = useNuxtApp()
 */
export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const gsapModule = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    const { ScrollSmoother } = await import('gsap/ScrollSmoother');
    const gsap = gsapModule.gsap || gsapModule.default || gsapModule;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    return {
      provide: { gsap, ScrollTrigger, ScrollSmoother },
    };
  },
});
