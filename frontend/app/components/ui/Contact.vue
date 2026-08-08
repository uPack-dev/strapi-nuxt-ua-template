<template>
  <CLinkTag v-if="link" class="ui-contact" :link="link.trim()">
    <CIcon v-if="iconName" :name="iconName" />

    <span class="ui-contact__text" :class="textClass">{{ text }}</span>
  </CLinkTag>
</template>

<script setup>
import { CONTACT_ICONS } from '@/configs/uiContactOptions';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  textClass: {
    type: String,
    default: '',
  },
});

const { $tp } = useNuxtApp();

const iconName = computed(() => CONTACT_ICONS[props.icon]);
// Non-breaking hyphen keeps compounds like «55-Ж» on one line
const text = computed(() => $tp(props.title).replace(/(\S)-(\S)/g, '$1‑$2'));
</script>

<style scoped lang="scss">
.ui-contact {
  transition: color $time-normal ease;

  &:active {
    color: $color-blue-light;
  }

  @include hover {
    &:not(:active) {
      color: $text-color-accent;
    }
  }
}
</style>
