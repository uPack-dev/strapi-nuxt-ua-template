<template>
  <label class="ui-input">
    <span v-if="label" class="ui-input__label i2-s-d">{{ label }}</span>

    <VeeField v-slot="{ field, errorMessage }" :name="name" :rules="rules">
      <input
        v-maska="mask"
        v-bind="field"
        class="ui-input__field i1-r-d"
        :class="errorMessage && 'ui-input__field--error'"
        :type="type"
        :placeholder="placeholder"
      />
    </VeeField>
  </label>
</template>

<script setup>
import { vMaska } from 'maska/vue';

defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rules: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
});
</script>

<style scoped lang="scss">
.ui-input {
  display: flex;
  flex-direction: column;
  gap: em(5);
  width: 100%;

  &__label {
    color: $color-navy;
  }

  &__field {
    width: 100%;
    padding: em(10, 24) em(20, 24);
    color: $color-field-text;
    outline: none;
    background: $background-color-field;
    border: none;
    transition: background-color $time-normal ease;

    &::placeholder {
      color: $color-field-text;
      opacity: 0.7;
    }

    &:focus {
      background: $background-color-field-active;
    }

    @include media-breakpoint-down(md) {
      padding: em(10, 20) em(20, 20);
    }

    &--error {
      background: $background-color-error;
      box-shadow: inset 0 0 0 em(1, 24) $color-error;

      @include media-breakpoint-down(md) {
        box-shadow: inset 0 0 0 em(1, 20) $color-error;
      }
    }
  }
}
</style>
