<template>
  <CSectionWrapper v-if="!isError && LoadedComponent" v-bind="sectionData">
    <component :is="LoadedComponent" v-bind="$attrs" />
  </CSectionWrapper>
</template>

<script setup>
import { BLOCKS } from '@/configs/blocks';
import { hydrateOnVisible } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  sectionData: {
    type: Object,
    default: () => ({}),
  },
  componentName: {
    type: String,
    required: true,
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
    return null;
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
