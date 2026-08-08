<template>
  <picture v-if="hasAnyUrl" class="image-responsive">
    <source
      v-if="mobile && mobile.url"
      :srcset="mobileSrcset"
      :type="mobile.mime"
      media="(max-width: 767px)"
    />

    <source
      v-if="tablet && tablet.url"
      :srcset="tabletSrcset"
      :type="tablet.mime"
      media="(max-width: 1023px)"
    />

    <CImage
      class="image-responsive__image"
      :image="desktop"
      :alt="alt"
      :loading="loading"
      :draggable="draggable"
      :sizes="sizes"
    />
  </picture>
</template>

<script setup>
import { buildSrcset } from '~/utils/helpers';

const props = defineProps({
  desktop: {
    type: Object,
    default: () => ({}),
  },
  tablet: {
    type: Object,
    default: () => ({}),
  },
  mobile: {
    type: Object,
    default: () => ({}),
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

const hasAnyUrl = computed(() =>
  [props.desktop, props.tablet, props.mobile].some((image) => image?.url),
);

const tabletSrcset = computed(() =>
  buildSrcset(props.tablet, 'url', ['large', 'medium', 'small']),
);

const mobileSrcset = computed(() =>
  buildSrcset(props.mobile, 'url', ['large', 'medium', 'small', 'thumbnail']),
);
</script>

<style lang="scss" scoped>
.image-responsive {
  display: block;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: inherit;
    object-position: inherit;
  }
}
</style>
