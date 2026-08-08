<template>
  <VueFinalModal
    v-slot="{ close }"
    class="modals-request"
    overlay-class="modals-request__overlay"
    content-class="modals-request__content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    teleport-to="#modal-root"
  >
    <UiIconButton
      :aria-label="$t('close', 'Закрити')"
      class="modals-request__close"
      @click="close"
    >
      <CIcon name="close" />
    </UiIconButton>

    <UiForm
      :request-context="requestContext"
      :request-data="requestData"
      @success="close"
    />
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';

defineProps({
  requestContext: {
    type: Object,
    default: () => ({}),
  },
  requestData: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="scss">
.modals-request {
  display: flex;
  align-items: center;
  justify-content: center;

  &__overlay {
    background-color: rgba($color-navy, 0.7);
  }

  &__content {
    position: relative;
    width: em(983);
    max-width: calc(100% - #{em(40)});
    padding: em(50);
    color: $color-navy;
    background-color: $background-color-primary;
    border-radius: em(10);

    @include media-breakpoint-down(md) {
      width: 100%;
      max-width: none;
      height: 100%;
      padding: em(85) em(20) em(30);
      overflow-y: auto;
      border-radius: 0;
    }
  }

  &__close {
    position: absolute;
    inset-block-start: em(30);
    inset-inline-end: em(30);
    width: em(55);
    height: em(55);

    @include media-breakpoint-down(md) {
      inset-block-start: em(20);
      inset-inline-end: em(20);
      width: em(45);
      height: em(45);
    }
  }
}
</style>
