<template>
  <Transition name="page" mode="out-in" appear>
    <CResize id="app" class="error app">
      <NuxtLayout v-slot="{ className }" class="error__layout">
        <CError :error="error" :class="[className]" />
      </NuxtLayout>
    </CResize>
  </Transition>
</template>

<script setup>
import { useGlobalStore } from '@/stores/global';
import { getRouteLocale } from '@/utils/locale';

defineProps({
  error: {
    type: Object,
    required: true,
  },
});

const route = useRoute();
const globalStore = useGlobalStore();

useHead({
  htmlAttrs: {
    lang: computed(() =>
      getRouteLocale(
        route.path,
        Array.isArray(globalStore.languages) ? globalStore.languages : [],
      ),
    ),
  },
});
</script>

<style scoped lang="scss">
.error {
  $parent: &;

  display: flex;
  flex-grow: 1;
  flex-direction: column;

  &:deep(#{$parent}__layout) {
    flex-grow: 1;
    background: $background-color-secondary;
  }

  @include rtl {
    direction: rtl;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
