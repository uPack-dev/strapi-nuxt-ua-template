import mitt from 'mitt';

/**
 * @returns Nuxt plugin providing `event`, `listen`, and `offEvent` methods.
 * @example const { $event } = useNuxtApp(); $event('ready')
 */
export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const emitter = mitt();
    return {
      provide: {
        offEvent: emitter.off,
        event: emitter.emit, // Will emit an event
        listen: emitter.on, // Will register a listener for an event
      },
    };
  },
});
