<template>
  <CLinkTag class="ui-icon-button">
    <slot />
  </CLinkTag>
</template>

<style scoped lang="scss">
.ui-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $icon-color-secondary;
  background: $color-blue-light;
  border-radius: 50%;
  transition: background-color $time-normal ease;

  &:focus-visible {
    outline: 2px solid $stroke-color-secondary;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px $stroke-color-primary;
  }

  &:active {
    background: $background-color-accent;
  }

  @include hover {
    &:not(:active) {
      background: $background-color-secondary;
    }
  }

  :deep(.c-icon) {
    width: 100%;
    height: 100%;
  }
}
</style>
