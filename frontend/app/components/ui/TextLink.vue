<template>
  <CLinkTag class="ui-text-link">
    <slot />
  </CLinkTag>
</template>

<style scoped lang="scss">
.ui-text-link {
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
