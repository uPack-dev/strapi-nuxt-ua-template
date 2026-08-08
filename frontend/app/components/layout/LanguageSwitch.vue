<template>
  <nav
    class="language-switch"
    :aria-label="$t('site_language_aria', 'Мова сайту')"
  >
    <CLinkTag
      v-for="language in displayedLanguages"
      :key="language.code"
      :link="localeLink(language.code)"
      :localized="false"
      :external="language.code !== currentLocale"
      class="language-switch__item"
      :class="{
        'language-switch__item--active': language.code === currentLocale,
      }"
    >
      <span class="i2-r-d">
        {{ labelOverrides[language.code] ?? language.code.toUpperCase() }}
      </span>
    </CLinkTag>
  </nav>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global';
import { getRouteLocale, stripRouteLocale } from '@/utils/locale';

const route = useRoute();
const store = useGlobalStore();

const labelOverrides = { uk: 'UA' };

const displayedLanguages = computed(() => {
  const languages = Array.isArray(store.languages) ? store.languages : [];
  const fallback = [{ code: 'uk', isDefault: true }, { code: 'en' }];
  return (languages.length ? languages : fallback).toSorted(
    (a, b) => Number(b.isDefault ?? false) - Number(a.isDefault ?? false),
  );
});

const currentLocale = computed(() =>
  getRouteLocale(route.path, displayedLanguages.value),
);

const localeLink = (code) => {
  const path = stripRouteLocale(route.path, displayedLanguages.value);
  return displayedLanguages.value.find((language) => language.code === code)
    ?.isDefault
    ? path
    : `/${code}${path === '/' ? '' : path}`;
};
</script>

<style scoped lang="scss">
.language-switch {
  position: absolute;
  inset-block-start: em(38);
  inset-inline-end: em(50);
  display: flex;
  gap: em(10);

  &__item {
    color: inherit;
    transition: color $time-normal ease;

    &:active {
      color: $color-blue-light;
    }

    @include hover {
      &:not(:active) {
        color: $text-color-accent;
      }
    }

    &--active {
      color: $text-color-accent;
    }
  }
}
</style>
