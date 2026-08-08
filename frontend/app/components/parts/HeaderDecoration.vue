<template>
  <div
    class="header-decoration"
    :class="{
      'header-decoration--menu-active': menuActive,
      'header-decoration--scrolled': scrolled,
    }"
    aria-hidden="true"
  >
    <div class="header-decoration__item header-decoration__item--blue" />

    <div class="header-decoration__item header-decoration__item--blue-light" />

    <div class="header-decoration__item header-decoration__item--orange" />

    <div
      class="header-decoration__item header-decoration__item--white hidden-mobile-tablet"
    />
  </div>
</template>

<script setup>
defineProps({
  menuActive: {
    type: Boolean,
    default: false,
  },
  scrolled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.header-decoration {
  $parent: &;

  position: absolute;
  inset: 0;
  pointer-events: none;

  &::before {
    position: absolute;
    inset-block: 0;
    inset-inline-start: min(0px, calc((#{em(1470)} - 100vw) / 2));
    width: calc(max(0px, (100vw - #{em(1470)}) / 2) + #{em(1440)});
    content: '';
    background: $color-navy;

    @include media-breakpoint-down(md) {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    #{$parent}__item {
      transition: none;
    }
  }

  &__item {
    position: absolute;
    height: 100%;
    transition:
      background-color $time-normal ease,
      width $time-normal ease,
      height $time-normal ease,
      clip-path $time-normal ease;

    @include media-breakpoint-down(md) {
      inset-inline: auto 0;
      height: em(70);
    }

    &--blue {
      inset-inline-start: em(899);
      width: em(571);
      background: $color-blue;
      clip-path: polygon(0 0, 22.43% 100%, 100% 100%, 100% 0);

      @include media-breakpoint-down(md) {
        inset-inline-start: auto;
        width: em(207);
        clip-path: polygon(0 0, 29.23% 100%, 100% 100%, 100% 0);
      }
    }

    &--blue-light {
      inset-inline-start: em(1024);
      width: em(446);
      background: $color-blue-light;
      clip-path: polygon(0 0, 28.67% 100%, 100% 100%, 100% 0);

      @include media-breakpoint-down(md) {
        inset-inline-start: auto;
        width: em(163);
        clip-path: polygon(0 0, 38.65% 100%, 100% 100%, 100% 0);
      }
    }

    &--orange {
      inset-block-start: 0;
      inset-inline-start: em(1129);
      width: em(269);
      height: em(144);
      background: $color-orange;
      clip-path: polygon(31.74% 0, 0 0, 68.26% 100%, 100% 100%);
      transition:
        background-color $time-normal ease-out,
        width $time-normal ease,
        height $time-normal ease,
        clip-path $time-normal ease;

      @include media-breakpoint-down(md) {
        inset-inline-start: auto;
        width: em(119);
        height: em(70);
        clip-path: polygon(0 0, 52.94% 100%, 100% 100%, 100% 0);
      }
    }

    &--white {
      inset-inline-start: em(1214);
      width: calc(max(0px, (100vw - #{em(1470)}) / 2) + #{em(256)});
      height: calc(100% + 1px);
      background: $color-white;
      clip-path: polygon(0 0, #{em(128.74)} 100%, 100% 100%, 100% 0);
    }
  }

  &--menu-active {
    #{$parent}__item--white {
      background: $color-navy;
    }
  }

  // collapsed strip on scroll: same slant angle as the full header, scaled to em(11) height
  &--scrolled {
    #{$parent}__item--blue {
      @include media-breakpoint-up(md) {
        clip-path: polygon(0 0, 2.47% 100%, 100% 100%, 100% 0);
      }
    }

    #{$parent}__item--blue-light {
      @include media-breakpoint-up(md) {
        clip-path: polygon(0 0, 3.15% 100%, 100% 100%, 100% 0);
      }
    }

    #{$parent}__item--orange {
      @include media-breakpoint-up(md) {
        width: em(154.5);
        height: em(54);
        clip-path: polygon(55.4% 0, 0 0, 44.6% 100%, 100% 100%);
      }
    }

    #{$parent}__item--white {
      @include media-breakpoint-up(md) {
        clip-path: polygon(0 0, #{em(15.3)} 100%, 100% 100%, 100% 0);
      }
    }
  }
}
</style>
