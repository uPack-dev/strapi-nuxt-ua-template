<template>
  <div class="resize">
    <slot />
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const onResize = () => {
  $event('window:resize');
};

onMounted(() => {
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<style lang="scss" scoped>
$design-width: 1440;
$default-size: 16;
$min-width: 768px;

.resize {
  font-size: min(calc($default-size * max($min-width, 100vw) / $design-width));

  // @include media-breakpoint-up(xl) {
  //   font-size: $default-size + px;
  // }

  @include media-breakpoint-down(md) {
    font-size: min(calc($default-size * max($min-width, 100vw) / 768));
  }

  @include media-breakpoint-down(sm) {
    font-size: $default-size + px;
  }
}
</style>
