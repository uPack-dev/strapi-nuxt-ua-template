<template>
  <span
    class="header-burger"
    :class="{ 'header-burger--active': isActive }"
    aria-hidden="true"
  >
    <span v-for="index in 3" :key="index" class="header-burger__line" />
  </span>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.header-burger {
  $parent: &;

  position: relative;
  display: block;
  width: em(34);
  height: em(23);

  @include media-breakpoint-down(md) {
    width: em(26);
    height: em(18);
  }

  &__line {
    position: absolute;
    inset-inline-start: 0;
    height: em(2);
    background: currentcolor;
    transition:
      inset-block-start $time-normal,
      inset-inline-start $time-normal,
      width $time-normal,
      opacity $time-normal,
      transform $time-normal;

    &:nth-child(1) {
      inset-block-start: 0;
      width: 100%;
    }

    &:nth-child(2) {
      inset-block-start: calc(50% - #{em(1)});
      width: 58.8%;
    }

    &:nth-child(3) {
      inset-block-start: calc(100% - #{em(2)});
      width: 20.6%;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  &--active {
    #{$parent}__line {
      &:nth-child(1),
      &:nth-child(3) {
        inset-block-start: calc(50% - #{em(1)});
        inset-inline-start: -10.4%;
        width: 120.7%;
      }

      &:nth-child(1) {
        transform: rotate(34deg);
      }

      &:nth-child(2) {
        width: 0;
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-34deg);
      }
    }
  }
}
</style>
