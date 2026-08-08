<script setup>
import { useTemplateRef } from 'vue';

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: 'bottom-start',
  },
  autoFlip: {
    type: Boolean,
    default: true,
  },
  triggerEvent: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'hover'].includes(value),
  },
  referenceRef: {
    type: Object,
    default: undefined,
  },
  hoverHideDelay: {
    type: Number,
    default: 300,
  },
  gap: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  escToClose: {
    type: Boolean,
    default: false,
  },
  contentFullWidth: {
    type: Boolean,
    default: false,
  },
});

const visible = shallowRef(props.opened);

const rootRef = useTemplateRef('rootRef');

function open() {
  if (props.disabled || visible.value) return;

  visible.value = true;
}

function close() {
  if (props.disabled || !visible.value) return;

  visible.value = false;
}

const referenceElement = computed(() => props.referenceRef || rootRef.value);

// <editor-fold desc="Handling events">
const triggerEvents = {
  hover: 'hover',
  click: 'click',
};
let hideTimeout = null;

// click
function onTriggerClick() {
  if (props.triggerEvent !== triggerEvents.click) return;

  if (visible.value) {
    close();
  } else {
    open();
  }
}

onMounted(() => {
  if (props.triggerEvent === triggerEvents.click) {
    onClickOutside(rootRef, close);
  }
});

// hover
function onPointerEnter() {
  if (props.triggerEvent === triggerEvents.hover) {
    clearTimeout(hideTimeout);
    open();
  }
}

function onPointerLeave() {
  if (props.triggerEvent === triggerEvents.hover) {
    hideTimeout = setTimeout(close, props.hoverHideDelay);
  }
}

// escape
function onEsc() {
  if (visible.value && props.escToClose) close();
}
// </editor-fold>

const stopWatcher = watch(
  () => props.opened,
  (opened) => {
    if (props.disabled) return;

    visible.value = opened;
  },
);

defineExpose({ open, close, visible });

onBeforeUnmount(() => {
  stopWatcher();
  clearTimeout(hideTimeout);
});
</script>

<template>
  <div
    ref="rootRef"
    class="dropdown"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @keydown.esc="onEsc"
  >
    <div
      class="dropdown__trigger"
      :class="{ 'dropdown__trigger--full-width': contentFullWidth }"
      @click="onTriggerClick"
    >
      <slot name="trigger" :visible="visible" />
    </div>

    <Transition name="fade">
      <CFloating
        v-if="visible"
        class="dropdown__content"
        :class="{ 'dropdown__content--full-width': contentFullWidth }"
        :reference-ref="referenceElement"
        :position="position"
        :auto-flip="autoFlip"
        :gap="gap"
      >
        <slot name="content" :close="close" />
      </CFloating>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;

  &__content {
    z-index: 100;

    &--full-width {
      width: max-content;
      min-width: 100%;
    }
  }

  &__trigger {
    &--full-width {
      width: 100%;
    }
  }
}
</style>
