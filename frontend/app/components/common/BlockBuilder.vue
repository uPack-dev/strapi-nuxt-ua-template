<template>
  <CSectionWrapper
    v-if="!isError && LoadedComponent"
    v-bind="blockData?.sectionData"
    :id="blockData?.sectionData?.id"
  >
    <component :is="LoadedComponent" v-bind="blockData" :main-info="mainInfo" />
  </CSectionWrapper>
</template>

<script setup>
// import BLOCKS from '@/blocks';
import { BLOCKS } from '@/configs/blocks';
import { defineAsyncComponent, hydrateOnVisible } from 'vue';

const props = defineProps({
  blockData: {
    type: Object,
    default: null,
  },
  component: {
    type: String,
    default: '',
  },
  componentName: {
    type: String,
    default: '',
  },
  mainInfo: {
    type: Object,
    default: null,
  },
});

const {
  public: { isDev },
} = useRuntimeConfig();

const isError = shallowRef(false);

const cName = computed(() => props.componentName.replace('blocks.', ''));

const LoadedComponent = computed(() => {
  if (!cName.value || !BLOCKS[cName.value]) {
    isError.value = true;
    return;
  }

  return defineAsyncComponent({
    loader: () =>
      import(`@/blocks/${BLOCKS[cName.value].component}.vue`).catch((error) => {
        isError.value = true;
        if (isDev)
          console.error(
            `Component ${cName.value} dynamic import error:`,
            error,
          );
        throw error;
      }),

    hydrate: hydrateOnVisible({ rootMargin: '100px' }),
  });
});
</script>
