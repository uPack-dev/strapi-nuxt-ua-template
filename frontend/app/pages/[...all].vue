<template>
  <div
    :class="[
      `page--${collectionName}`,
      'page',
      data?.mainInfo.header_overlay ? 'page--overlay' : '',
    ]"
  >
    <CBlockBuilder
      v-for="block in pageData"
      :key="block.id"
      :component="block.component"
      :component-name="block.__component"
      :block-data="block"
      :main-info="data?.mainInfo"
    />
  </div>
</template>

<script setup>
import { useSeo } from '@/composables/useSeo';
import { useStrapiRequest } from '@/composables/useStrapiRequest';
import { useRouteParams } from '@/composables/useRouteParams';
import { useBlocksRequest } from '@/composables/useBlocksRequest';
import { useSchema } from '@/composables/useSchema';

definePageMeta({
  pageTransition: {
    name: 'page',
    appear: true,
    mode: 'out-in',
    onBeforeEnter: () => {
      const { $event } = useNuxtApp();
      $event('page:start');
    },
  },
});

const route = useRouteParams();
const { page, slug } = route;
const collection = slug ? page : 'pages';
const collectionName = slug ? slug : page ? page : 'main';

const data = await useStrapiRequest(collection, collectionName, route);
const pageData = await useBlocksRequest(data?.blocks);
useSchema(data);
useSeo(data?.seo);
</script>
