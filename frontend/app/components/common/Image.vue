<template>
  <img v-if="image" v-bind="attrs" />
</template>

<script setup>
import { buildSrcset } from '~/utils/helpers';

const props = defineProps({
  image: {
    type: Object,
    default: undefined,
  },
  alt: {
    type: String,
    default: undefined,
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: (v) => v === 'lazy' || v === 'eager',
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: String,
    default: '',
  },
});

const attrs = computed(() => {
  const { image, alt, loading, draggable, sizes } = props;

  if (!image) return {};

  const attrs = {
    src: image.url,
    loading: loading,
    draggable: draggable,
    alt: image?.alternativeText || alt || undefined,
    width: image?.width || undefined,
    height: image?.height || undefined,
    sizes: sizes || undefined,
    srcset: buildSrcset(image, 'url', [
      'large',
      'medium',
      'small',
      'thumbnail',
    ]),
  };

  if (attrs.loading === 'eager') attrs.fetchpriority = 'high';
  if (!attrs.alt) attrs['aria-hidden'] = 'true';

  return attrs;
});
</script>
