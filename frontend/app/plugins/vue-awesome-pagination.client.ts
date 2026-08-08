import VueAwesomePaginate from 'vue-awesome-paginate';
import 'vue-awesome-paginate/dist/style.css';

/**
 * @returns Client plugin installing Vue Awesome Paginate.
 * @example // Auto-loaded by Nuxt on the client.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueAwesomePaginate);
});
