<template>
  <header
    class="header"
    :class="{
      'header--menu-active': isMenuActive,
      'header--scrolled': y > 0,
      'header--collapsed': isCollapsed,
    }"
  >
    <div class="header__inner">
      <PartsHeaderDecoration
        :menu-active="isMenuActive"
        :scrolled="isCollapsed"
      />

      <CLinkTag
        class="header__logo"
        link="/"
        :aria-label="$t('to_main', 'На головну')"
      >
        <CIcon v-if="logo" :raw="logo" />
      </CLinkTag>

      <CLinkTag
        class="header__menu"
        type="button"
        :aria-label="
          isMenuActive
            ? $t('close_menu', 'Закрити меню')
            : $t('open_menu', 'Відкрити меню')
        "
        :aria-pressed="isMenuActive"
        @click="toggleMenu"
      >
        <span class="header__menu-content">
          <span class="header__menu-label h5-s-d hidden-mobile-tablet">
            {{ $t('Menu') }}
          </span>

          <LHeaderBurger :is-active="isMenuActive && !isMobile" />
        </span>
      </CLinkTag>

      <LLanguageSwitch class="header__language-switch hidden-mobile-tablet" />
    </div>

    <LHeaderMenu
      v-model:active="isMenuActive"
      :links="links"
      :download="download"
      :image="image"
      :contacts="contacts"
      :socials="socials"
    />
  </header>
</template>

<script setup>
import { useMediaQuery, useWindowScroll } from '@vueuse/core';

defineProps({
  logo: {
    type: String,
    default: '',
  },
  links: {
    type: Array,
    default: () => [],
  },
  download: {
    type: Object,
    default: () => ({}),
  },
  image: {
    type: Object,
    default: () => ({}),
  },
  contacts: {
    type: Array,
    default: () => [],
  },
  socials: {
    type: Array,
    default: () => [],
  },
});
const { y } = useWindowScroll();
const isMobile = useMediaQuery('(max-width: 1023.98px)');
const isMenuActive = ref(false);

const isCollapsed = computed(() => y.value > 50 && !isMenuActive.value);

const toggleMenu = () => {
  isMenuActive.value = !isMenuActive.value;
};
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- deep selector targets child-owned BEM class */
.header {
  $parent: &;

  height: em($header-height);
  background: $background-color-primary;
  transition: height $time-normal;

  &:has(#{$parent}__menu:focus-visible) {
    :deep(.header-decoration__item--orange) {
      background: $color-navy;
    }
  }

  @include hover {
    &:has(#{$parent}__menu:hover) {
      :deep(.header-decoration__item--orange) {
        background: $color-navy;
      }
    }
  }

  @include media-breakpoint-down(md) {
    height: em($header-height-adaptive);
    background: $background-color-secondary;
    transition: box-shadow $time-normal;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    #{$parent}__logo,
    #{$parent}__menu,
    #{$parent}__menu-content,
    #{$parent}__language-switch {
      transition: none;
    }
  }

  &__inner {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 50%;
    z-index: 2;
    width: 100%;
    max-width: em(1470);
    filter: drop-shadow(0 em(4) em(18) rgba($color-shadow, 0));
    transform: translateX(-50%);
    transition: filter $time-normal;

    @include media-breakpoint-down(md) {
      filter: none;
      transition: none;
    }
  }

  &__logo {
    position: absolute;
    inset-block-start: em(12);
    inset-inline-start: em(50);
    width: em(188);
    height: em(77);
    transition:
      opacity $time-normal,
      visibility $time-normal;

    @include media-breakpoint-down(md) {
      inset-block-start: em(10);
      inset-inline-start: em(20);
      width: em(122.28);
      height: em(50);
    }
  }

  &__menu {
    position: absolute;
    inset-block-start: em(38);
    inset-inline-start: em(1227);
    display: flex;
    align-items: center;
    justify-content: center;
    width: em(112);
    height: em(96);
    padding: 0;
    color: $color-white;
    background: none;
    transition:
      inset-block-start $time-normal,
      inset-inline-start $time-normal,
      width $time-normal,
      height $time-normal;

    // extra hit area over the top of the orange ribbon (the collapsed-tab zone)
    &::before {
      @include media-breakpoint-up(md) {
        position: absolute;
        inset-block-start: em(-38);
        inset-inline-start: em(-98);
        width: em(154.5);
        height: em(54);
        content: '';
      }
    }

    @include media-breakpoint-down(md) {
      inset-block-start: 0;
      inset-inline: auto 0;
      width: em(70);
      height: em(70);
    }
  }

  &__menu-content {
    display: flex;
    gap: em(20);
    align-items: center;
    transform: rotate(38deg);
    transition: transform $time-normal;

    @include media-breakpoint-down(md) {
      gap: 0;
      transform: translateX(em(-3));
    }
  }

  &__language-switch {
    transition:
      color $time-fast ease,
      opacity $time-normal,
      visibility $time-normal;
  }

  &--collapsed {
    @include media-breakpoint-up(md) {
      height: em(11);
    }

    #{$parent}__logo {
      @include media-breakpoint-up(md) {
        visibility: hidden;
        opacity: 0;
      }
    }

    #{$parent}__menu {
      &::before {
        @include media-breakpoint-up(md) {
          content: none;
        }
      }

      @include media-breakpoint-up(md) {
        inset-block-start: 0;
        inset-inline-start: em(1129);
        width: em(154.5);
        height: em(54);
      }
    }

    #{$parent}__menu-label {
      @include media-breakpoint-up(md) {
        display: none;
      }
    }

    #{$parent}__menu-content {
      @include media-breakpoint-up(md) {
        gap: 0;
        transform: translate(em(13), em(10)) rotate(38deg);
      }
    }

    #{$parent}__language-switch {
      @include media-breakpoint-up(md) {
        visibility: hidden;
        opacity: 0;
      }
    }
  }

  &--scrolled {
    @include media-breakpoint-down(md) {
      box-shadow: 0 em(4) em(18) rgba($color-shadow, 0.24);
    }

    #{$parent}__inner {
      @include media-breakpoint-up(md) {
        filter: drop-shadow(0 em(4) em(18) rgba($color-shadow, 0.24));
      }
    }
  }

  &--menu-active {
    #{$parent} {
      &__inner {
        filter: none;
      }

      &__language-switch {
        color: $color-white;
      }
    }
  }
}
</style>
