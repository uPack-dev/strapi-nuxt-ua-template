<template>
  <CLinkTag
    class="ui-button"
    :class="[`ui-button--theme--${theme}`, `ui-button--size--${size}`]"
    :link="actionProps.link"
    :external="actionProps.external"
    :target="actionProps.target"
    @click="onClick"
  >
    <CIcon v-if="icon" class="ui-button__icon" :name="icon" />

    <span class="ui-button__text" :class="textClass">
      <template v-if="text">{{ $tp(text) }}</template>

      <slot v-else />
    </span>
  </CLinkTag>
</template>

<script setup>
import { useModal } from 'vue-final-modal';
import {
  BUTTON_ACTION,
  BUTTON_SIZE,
  BUTTON_THEME,
  getButtonActionProps,
} from '@/configs/uiButtonOptions';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  link: {
    type: [String, Boolean],
    default: false,
  },
  theme: {
    type: String,
    default: BUTTON_THEME.PRIMARY,
    validator: (value) => Object.values(BUTTON_THEME).includes(value),
  },
  size: {
    type: String,
    default: BUTTON_SIZE.SM,
    validator: (value) => Object.values(BUTTON_SIZE).includes(value),
  },
  action: {
    type: String,
    default: BUTTON_ACTION.LINK,
    validator: (value) => Object.values(BUTTON_ACTION).includes(value),
  },
  textClass: {
    type: String,
    default: 'button-s-a',
  },
  context: {
    type: Object,
    default: () => ({}),
  },
  icon: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['action']);
const requestModal = useModal({
  component: resolveComponent('LazyModalsRequest'),
});
const actionProps = computed(() =>
  getButtonActionProps(props.action, props.link),
);

const onClick = () => {
  if (actionProps.value.isCallback) {
    requestModal.patchOptions({ attrs: { requestContext: props.context } });
    requestModal.open();
  }
  emit('action', props.action);
};
</script>

<style scoped lang="scss">
.ui-button {
  display: inline-flex;
  gap: em(10);
  align-items: center;
  justify-content: center;
  transition:
    color $time-normal ease,
    background-color $time-normal ease,
    border-color $time-normal ease;

  &:focus-visible {
    outline: 2px solid $stroke-color-secondary;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px $stroke-color-primary;
  }

  &__icon {
    flex: 0 0 em(22);
    width: em(22);
    height: em(22);

    @include media-breakpoint-down(md) {
      flex-basis: em(18);
      width: em(18);
      height: em(18);
    }
  }

  &--size--sm {
    height: em(57);
    padding-inline: em(40);

    @include media-breakpoint-down(md) {
      height: em(47);
      padding-inline: em(20);
    }
  }

  &--theme--primary {
    color: $text-color-secondary;
    background: $background-color-accent;

    &:active {
      background: $background-color-secondary;
    }

    @include hover {
      &:not(:active) {
        background: $color-blue-light;
      }
    }
  }

  &--theme--secondary {
    color: $color-navy;
    background: transparent;
    border: 2px solid $stroke-color-primary;

    &:active {
      color: $color-blue-light;
      border-color: $color-blue-light;
    }

    @include hover {
      &:not(:active) {
        color: $text-color-accent;
        border-color: $stroke-color-accent;
      }
    }
  }
}
</style>
