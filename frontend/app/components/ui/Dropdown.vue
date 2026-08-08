<template>
  <div class="ui-dropdown">
    <CLinkTag
      type="button"
      class="ui-dropdown__toggle"
      :class="{ 'ui-dropdown__toggle--active': isActive }"
      :aria-expanded="isActive"
      @click="emit('click')"
    >
      <span class="ui-dropdown__text h6-s-d">{{ $tp(title) }}</span>

      <CIcon
        class="ui-dropdown__icon"
        :class="{ 'ui-dropdown__icon--active': isActive }"
        :name="icon"
      />
    </CLinkTag>

    <Collapse class="ui-dropdown__content" :when="isActive">
      <slot />
    </Collapse>
  </div>
</template>

<script setup>
import { Collapse } from 'vue-collapsed';

defineProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'menu/chevron-right',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);
</script>

<style scoped lang="scss">
.ui-dropdown {
  width: 100%;

  @media (prefers-reduced-motion: reduce) {
    &__toggle,
    &__icon,
    &__content {
      transition: none;
    }
  }

  &__icon {
    flex: 0 0 em(20);
    width: em(20);
    height: em(22);
    transition: transform $time-normal ease;

    &--active {
      transform: rotate(90deg);
    }
  }

  &__toggle {
    display: flex;
    gap: em(10);
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
    transition: color $time-normal ease;

    &:active {
      color: $color-blue-light;
    }

    @include hover {
      &:not(:active) {
        color: $text-color-accent;
      }
    }

    &--active {
      color: $text-color-accent;
    }
  }

  &__content {
    width: 100%;
    transition: height var(--vc-auto-duration) cubic-bezier(0.33, 1, 0.68, 1);
  }
}
</style>
