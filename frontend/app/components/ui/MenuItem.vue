<template>
  <CLinkTag class="ui-menu-item" :link="link">
    <CIcon v-if="icon" :name="icon" />

    <span class="ui-menu-item__text" :class="textClass">
      {{ $tp(text) }}
    </span>
  </CLinkTag>
</template>

<script setup>
defineProps({
  text: {
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
</script>

<style scoped lang="scss">
.ui-menu-item {
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
