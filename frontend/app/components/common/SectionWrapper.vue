<template>
  <section :id="id || undefined" class="section-wrapper" :style="cssVars">
    <slot />
  </section>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  paddingTop: {
    type: Number,
    default: 0,
  },
  paddingBottom: {
    type: Number,
    default: 0,
  },
  paddingTopMobile: {
    type: Number,
    default: null,
  },
  paddingBottomMobile: {
    type: Number,
    default: null,
  },
  background: {
    type: String,
    default: null,
  },
  id: {
    type: [Number, String],
    default: '',
  },
});

const baseFontSize = 16;

function pxToEm(value) {
  const num = Number(value) || 0;
  return `${num / baseFontSize}em`;
}

const cssVars = computed(() => {
  const paddingTop = Number(props.paddingTop) || 0;
  const paddingBottom = Number(props.paddingBottom) || 0;
  const paddingTopMobile =
    props.paddingTopMobile !== null
      ? Number(props.paddingTopMobile) || 0
      : paddingTop;
  const paddingBottomMobile =
    props.paddingBottomMobile !== null
      ? Number(props.paddingBottomMobile) || 0
      : paddingBottom;

  const vars = {
    '--pt': pxToEm(paddingTop),
    '--pb': pxToEm(paddingBottom),
    '--pt-mobile': pxToEm(paddingTopMobile),
    '--pb-mobile': pxToEm(paddingBottomMobile),
  };

  if (props.background) vars['--bg'] = props.background;

  return vars;
});
</script>

<style lang="scss">
// .section-wrapper {
//   padding-top: var(--pt);
//   padding-bottom: var(--pb);
//   background-color: var(--bg);

//   @include media-breakpoint-down(md) {
//     padding-top: var(--pt-mobile);
//     padding-bottom: var(--pb-mobile);
//   }
// }
</style>
