<template>
  <div
    class="ui-slider"
    :class="[
      `ui-slider--overflow--${overflow}`,
      { 'ui-slider--pending': !isReady },
    ]"
  >
    <div v-if="!isReady && items.length" class="ui-slider__static">
      <slot :data="items[0]" />
    </div>

    <swiper-container ref="swiperRef" class="ui-slider__swiper" :init="false">
      <swiper-slide
        v-for="(item, index) in items"
        :key="item.id ?? index"
        class="ui-slider__slide"
      >
        <slot :data="item" />
      </swiper-slide>
    </swiper-container>

    <div class="ui-slider__controls">
      <CLinkTag
        class="ui-slider__control ui-slider__control--previous"
        :aria-label="ariaLabelPrevious"
        @click="swiper.prev()"
      >
        <CIcon class="ui-slider__control-icon" name="slider/arrow" />
      </CLinkTag>

      <div ref="paginationRef" class="ui-slider__pagination" />

      <CLinkTag
        class="ui-slider__control"
        :aria-label="ariaLabelNext"
        @click="swiper.next()"
      >
        <CIcon class="ui-slider__control-icon" name="slider/arrow" />
      </CLinkTag>
    </div>
  </div>
</template>

<script setup>
import { SLIDER_OVERFLOW } from '@/configs/uiSliderOptions';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  options: {
    type: /** @type {import('vue').PropType<import('swiper/types').SwiperOptions>} */ (
      Object
    ),
    default: () => ({}),
  },
  overflow: {
    type: String,
    default: SLIDER_OVERFLOW.HIDDEN,
    validator: (value) => Object.values(SLIDER_OVERFLOW).includes(value),
  },
  ariaLabelPrevious: {
    type: String,
    default: 'Попередній слайд',
  },
  ariaLabelNext: {
    type: String,
    default: 'Наступний слайд',
  },
});

const swiperRef = ref(null);
const paginationRef = ref(null);
const swiperOptions = {
  a11y: {
    enabled: true,
  },
  autoHeight: true,
  rewind: true,
  speed: 250,
  ...props.options,
  pagination: {
    clickable: true,
    ...props.options.pagination,
  },
};
const swiper = useSwiper(swiperRef, swiperOptions);
// While the swiper element boots, its empty shadow root unrenders the light
// DOM slides; until then a static copy of the first slide holds the layout.
const isReady = computed(() => Boolean(unref(swiper.instance)));

onMounted(async () => {
  swiperOptions.pagination.el = paginationRef.value;
  // The custom element registers via an async chunk and may become defined
  // only after mount; useSwiper's own initialize is a no-op until then, so
  // re-run it once the element is upgraded (initialize() guards repeats).
  await customElements.whenDefined('swiper-container');
  swiper.reInitialize();
});
</script>

<style scoped lang="scss">
.ui-slider {
  $parent: &;

  &__swiper {
    display: block;
  }

  &--pending {
    position: relative;

    #{$parent}__swiper {
      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;
      visibility: hidden;
    }
  }

  &__pagination {
    display: flex;
    gap: em(5);
    align-items: center;
    justify-content: center;

    :deep(.swiper-pagination-bullet) {
      display: block;
      width: em(9);
      height: em(9);
      margin: 0;
      cursor: pointer;
      background: $background-color-secondary;
      border-radius: 50%;
      opacity: 1;
      transition: background-color $time-normal ease;

      @include hover {
        &:not(.swiper-pagination-bullet-active) {
          background: $background-color-accent;
        }
      }
    }

    :deep(.swiper-pagination-bullet-active) {
      background: $background-color-accent;
    }

    :deep(.swiper-pagination-bullet:focus-visible) {
      outline: 2px solid $stroke-color-accent;
      outline-offset: 2px;
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: em(31) 1fr em(31);
    align-items: center;
    height: em(22);
    margin-top: em(20);
  }

  &__control {
    width: em(31);
    height: em(22);
    color: $icon-color-primary;
    transition: color $time-normal ease;

    &:focus-visible {
      outline: 2px solid $stroke-color-accent;
      outline-offset: 2px;
    }

    @include hover {
      &:not(:active) {
        color: $icon-color-accent;
      }
    }

    &--previous {
      transform: rotate(180deg);
    }
  }

  &__control-icon {
    display: block;
    width: 100%;
    height: 100%;
  }

  &--overflow--visible {
    #{$parent}__swiper {
      overflow: visible;
    }

    #{$parent}__swiper::part(container) {
      overflow: visible;
    }
  }
}
</style>
