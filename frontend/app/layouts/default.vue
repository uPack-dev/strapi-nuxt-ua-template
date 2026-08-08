<template>
  <div class="layouts-default">
    <LHeader v-bind="layoutData?.header" class="layouts-default__header" />

    <main class="layouts-default__content">
      <div class="layouts-default__wrapper">
        <slot class-name="layouts-default__view" />
      </div>
    </main>

    <LFooter v-if="layoutData?.footer" v-bind="layoutData?.footer" />

    <div id="modal-root" />

    <ClientOnly>
      <ModalsContainer />
    </ClientOnly>
  </div>
</template>

<script setup>
import { useSeo } from '@/composables/useSeo';
import { ModalsContainer } from 'vue-final-modal';
import { useScrollLock } from '@/composables/useScrollLock';
import { tryOnBeforeUnmount } from '@vueuse/core';
import { useGlobalStore } from '@/stores/global';
import generateSitemapRoutes from '@/utils/sitemapRoutes';

const globalStore = useGlobalStore();

const { $ScrollTrigger } = useNuxtApp();
const {
  public: { clientUrl },
} = useRuntimeConfig();

useSeo();

const scrollLock = useScrollLock();

const layoutData = computed(() => {
  return globalStore.layoutData;
});

defineProps({
  className: {
    type: String,
    default: undefined,
  },
});

function enableScroll() {
  requestAnimationFrame(() => {
    scrollLock.unlock();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.height = '';
    document.body.style.height = '';
  });
}

onMounted(() => {
  enableScroll();
  window.__debugSitemap = async () => {
    window.__sitemapRoutes = await generateSitemapRoutes(clientUrl);
  };
});

tryOnBeforeUnmount(() => {
  $ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  scrollLock.unlock();
});
</script>

<style scoped lang="scss">
.layouts-default {
  $parent: &;

  display: flex;
  flex-direction: column;

  &:deep(#{$parent}__view) {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  &__header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
}
</style>
