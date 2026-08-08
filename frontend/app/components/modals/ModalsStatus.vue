<template>
  <VueFinalModal
    v-slot="{ close }"
    class="modals-status"
    overlay-class="modals-status__overlay"
    content-class="modals-status__content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    teleport-to="#modal-root"
  >
    <UiIconButton
      :aria-label="$t('close', 'Закрити')"
      class="modals-status__close"
      @click="closeModal(close)"
    >
      <CIcon name="close" />
    </UiIconButton>

    <CIcon v-if="status" :name="status" class="modals-status__status" />

    <div class="modals-status__info">
      <div v-if="title" class="modals-status__title">
        <p class="h4-r-d" v-html="$tp(title)" />
      </div>

      <div v-if="description" class="modals-status__description">
        <p class="s2-r-d" v-html="$tp(description)" />
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';

const emit = defineEmits(['close']);

defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
});

function closeModal(handler) {
  emit('close');

  handler();
}
</script>

<style lang="scss">
.modals-status {
  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    background-color: rgba($color-black, 0.5);
  }

  &__content {
    position: relative;
    width: 100%;
    max-width: em(457);
    padding: em(32);
    background-color: $color-white;

    @include media-breakpoint-down(sm) {
      max-width: 90vw;
    }
  }

  &__close {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: calc(100% + #{em(10)});
    width: em(45);
    height: em(45);

    @include media-breakpoint-down(md) {
      inset-block-start: unset;
      inset-block-end: calc(100% + #{em(10)});
      inset-inline-start: unset;
      inset-inline-end: em(10);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: em(16);
  }

  &__title,
  &__description {
    text-align: center;
  }

  &__title {
    color: $text-color-primary;
  }

  &__description {
    color: $text-color-primary;
  }

  &__status {
    width: em(90);
    height: em(90);
    margin: 0 auto em(32);
  }
}
</style>
