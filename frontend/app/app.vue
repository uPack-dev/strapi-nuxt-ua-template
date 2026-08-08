<template>
  <CResize id="app" class="app">
    <NuxtLayout v-slot="{ className }" class="app__layout">
      <div :class="className">
        <NuxtPage :keepalive="false" />
      </div>
    </NuxtLayout>
  </CResize>
</template>

<script setup>
import { useVfm } from 'vue-final-modal';
import { useGlobalStore } from '@/stores/global';
import { getRouteLocale } from '@/utils/locale';

const route = useRoute();
const { closeAll } = useVfm();
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

const stopWatcher = watch(
  route,
  (newRoute, oldRoute) => {
    // Don't close modals if only the hash changed
    if (newRoute.fullPath.split('#')[0] === oldRoute.fullPath.split('#')[0]) {
      return;
    }
    closeAll();
  },
  { deep: true },
);

tryOnBeforeUnmount(() => {
  stopWatcher();
});
</script>

<style scoped lang="scss">
.app {
  $parent: &;

  display: flex;
  flex-direction: column;

  &:deep(#{$parent}__layout) {
    flex-grow: 1;
  }

  @include rtl {
    direction: rtl;
  }
}
</style>
