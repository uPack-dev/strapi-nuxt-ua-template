<script setup>
import { sanitizeSvg } from '@/utils/sanitizeSvg';

/**
 * Icons folder: '/assets/icons'
 * @example
 * <CIcon name="icon-path/icon-name">
 * <CIcon :raw="svgMarkup">
 * @see https://github.com/cpsoinos/nuxt-svgo
 */

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  raw: {
    type: String,
    default: '',
  },
});

const icon = computed(() => {
  return `svgo-${props.name.split('/').join('-')}`;
});

const safeRaw = computed(() => sanitizeSvg(props.raw));
</script>

<template>
  <span v-if="safeRaw" class="c-icon" v-html="safeRaw" />

  <component :is="icon" v-else-if="name" class="c-icon" />
</template>

<style scoped lang="scss">
.c-icon {
  overflow: visible;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
