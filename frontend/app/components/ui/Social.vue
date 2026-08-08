<template>
  <CLinkTag
    v-if="link && icon"
    class="ui-social"
    :link="link"
    :aria-label="icon"
  >
    <CIcon :name="`menu/${icon}`" />
  </CLinkTag>
</template>

<script setup>
defineProps({
  link: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss">
.ui-social {
  transition: opacity $time-normal ease;

  @include hover {
    opacity: 0.75;
  }
}
</style>
