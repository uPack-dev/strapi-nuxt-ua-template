# Frontend Code Conventions (Nuxt Projects)

Rules for AI agents writing code in this codebase family. Generated code must be indistinguishable from existing code.

## Language rules

- JavaScript in `.vue` components (no `lang="ts"`). TypeScript welcome in `stores/`, `configs/`, `composables/`, `utils/`
- SSR + ISR: `routeRules: { '/**': { isr: true } }`

## Directory layout

```
adapters/        # pure functions: Strapi response → component props
assets/styles/   # SCSS: base/ (global) + utils/ (variables, mixins, typography)
blocks/          # page sections, rendered via CBlockBuilder
components/
  common/   # infra components, prefix C  (CIcon, CImage, CBlockBuilder)
  cards/    # prefix Card (CardArticle)
  layout/   # prefix L (header/footer)
  modals/   # vue-final-modal wrappers (ModalsCallback, ModalsStatus)
  sliders/  # prefix S (swiper)
  ui/       # UI kit, prefix Ui (UiButton, UiInput, UiDropdown)
composables/     # useX.js / useX.ts
configs/         # dictionaries: blocks.js, populates.js, ui*Options.js
constants/       # variables.js — UPPER_SNAKE_CASE constants
stores/          # Pinia stores
utils/           # pure helpers with full JSDoc
pages/[...all].vue  # catch-all: pages are built from Strapi blocks
```

Component prefixes are auto-registered in `nuxt.config.js` → `components:`. Use them globally in templates without imports: `<UiButton>`, `<CIcon>`, `<CardArticle>`.

## Core architecture: CMS-driven blocks

A page is an array of blocks from Strapi:

1. `pages/[...all].vue` → `useStrapiRequest(collection, slug, route)` fetches page data with populate lists from `configs/populates.js`. Missing page → `throw createError({ status: 404, message: 'Page Not Found', fatal: true })`.
2. `<CBlockBuilder>` maps `__component` (`blocks.faq`) to a component via the `BLOCKS` dictionary in `configs/blocks.js`, loads it with `defineAsyncComponent` + `hydrateOnVisible`.
3. Block components in `blocks/` receive Strapi fields directly as props (`title`, `items`, `sectionData`).

Adding a block = file in `blocks/` + entry in `configs/blocks.js` + populate entry in `configs/populates.js` if needed.

## Components

Section order: `<template>` → `<script setup>` → `<style scoped lang="scss">`.

```vue
<template>
  <div class="faq-block">
    <div v-if="title" class="faq-block__title">
      <h2 class="h2-l-d">{{ $tp(title) }}</h2>
    </div>
  </div>
</template>

<script setup>
import { CHIP_THEME } from '@/configs/uiChipOptions';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['click']);

const link = computed(() => `/articles/${props.slug}`);

function onActiveChange(index) {}
</script>
```

- Always `<script setup>`. Rely on Nuxt auto-imports (`ref`, `computed`, `useNuxtApp`, …)
- Prefer `common/` components over native tags: `<CLinkTag>` instead of `<a>`/`<nuxt-link>`/`<button>` (resolves the tag from its props), `<CImage>` instead of `<img>` (Strapi image object, responsive), `<CIcon name="...">` instead of inline SVG. Raw tags are the exception, not the rule
- Reusable card markup belongs in `components/cards/` and uses the `Card` prefix. Blocks own section composition and must not duplicate card markup for different breakpoints
- Icon SVGs in `assets/icons/` use `currentColor` for every fill/stroke (color comes from CSS on the consumer) and have no `width`/`height` on the `<svg>` tag — only `viewBox`; size is set by the component
- Props: object form with `type` + `default` (`() => []` / `() => ({})` for Array/Object). Enum props get a `validator` checking `Object.values(OPTIONS)`
- Component variants (theme/size/icon) come from dictionaries in `configs/ui*Options.js` (`BUTTON_THEME.PRIMARY`) — never string literals at call sites
- Guard CMS-driven nodes with `v-if="field"` — CMS data can be empty
- Separate direct sibling content nodes in Vue templates with one blank line. This includes elements, components, conditional `<template>` blocks, and text/interpolations next to an element. Keep multiline attributes inside one opening tag together
- Text goes through `$tp(...)` (typograf plugin); translations via `useT()` keyed to the global store
- Modals: `useModal({ component: resolveComponent('LazyModalsX') })` → `.open()`; teleport to `#modal-root`
- No `console.log` in final code

## SCSS

- Strict BEM: block = kebab-case component name (`ui-button`, `faq-block`), `&__element`, `&--modifier`, compound `&--theme--black`. Nested modifier targeting via `$parent: &;` + `#{$parent}`
- Never set `max-width`/centering on a block section directly. The global `.container` helper (`assets/styles/base/container.scss`) owns the canvas width (`em(1440)`), side gutters (`em(50)` desktop, `em(20)` below `md`), and centering. Structure: `.hero-block > .hero-block__container.container > content` — the wrapper carries both the BEM class and `container`. The BEM class overrides only deviations (scoped styles win on specificity), e.g. `padding-inline: 0` on mobile when a child must be full-bleed with gutters on the children. Full-bleed background with constrained content = background on the block root, `.container` on the wrapper inside
- In scoped Vue styles, target local markup only by classes. Do not use tag selectors (`div`, `span`, `a`, `h2`, etc.); `:deep(...)` is allowed for markup owned by child components
- Nest modifier-dependent elements inside the modifier via `$parent`: `&--menu { #{$parent}__decoration { ... } }`, never flatten them as `&--menu &__decoration`
- Colors only via SCSS variables (`$text-color-primary`, `$background-color-secondary`, `$stroke-color-*`); opacity via `rgba($var, 0.2)`
- Responsive: `@include media-breakpoint-down(md)` (Bootstrap). Helpers: `@include hover` (hover-capable devices only), `@include rtl`, `@include hide-scroll`, `@include box($size)`
- **Responsive declarations must be colocated inside the selector they modify.** Never group media queries at the bottom of a file re-opening the block selector. Breakpoints live directly inside the BEM element/modifier/pseudo-element they override — not as a sibling block that re-opens `.block-name { &__element { ... } }`. Multiple breakpoints on the same selector are ordered from broader (`lg`) to narrower (`sm`)

  ```scss
  // ✗ BAD — grouped block at the bottom
  .hero-block {
    &__title {
      font-size: em(48);
    }
  }

  @include media-breakpoint-down(md) {
    .hero-block {
      &__title {
        font-size: em(24);
      }
    }
  }

  // ✓ GOOD — colocated inside the selector
  .hero-block {
    &__title {
      font-size: em(48);

      @include media-breakpoint-down(md) {
        font-size: em(24);
      }
    }
  }
  ```
- To hide an element on specific viewports, use the global helper classes in the template (`hidden-mobile`, `hidden-tablet`, `hidden-desktop`, `hidden-mobile-tablet`, `hidden-mobile-desktop`, `hidden-tablet-desktop` — mobile <768, tablet 768–1023.98, desktop ≥1024), not `display: none` inside a media query in component styles. The helpers carry `!important` and always win, which prevents flicker during hydration. `display: none` in SCSS stays only where a class can't reach (pseudo-elements) or when hiding depends on state, not viewport
- Logical properties for RTL support: `margin-inline-start/end`, not left/right

### Fluid scaling (em + CResize)

The whole layout scales with the viewport. Do not fight this system:

- `<CResize>` wraps the app and sets root `font-size` fluidly: `min(calc(16px * max(768px, 100vw) / $design-width))`, pinned to `16px` on xl-and-up and on small mobile. `$design-width` = layout width from the design file (e.g. 1600)
- Every size in components is written via the `em($px)` SCSS function (`em(16)` = 16px at design width): `gap: em(16)`, `padding: em(12) em(16)`. Because root font-size scales, all `em` values scale proportionally between breakpoints. Raw px only for small borders/outlines (1–2px)
- Take px values straight from the design mockup and wrap them in `em()` — no manual math
- In JS, when a pixel value must match this scaling (canvas, sliders, maps), use `toResizedPx()` from utils or the `useResizedPx` composable; re-compute on the `window:resize` event emitted by `CResize` via the mitt `$event` bus

### Typography

- Text styles are generated utility classes named `{style}-{weight}-{family}`, e.g. `h2-l-d`, `s3-l-d`, `i2-r-a`: style (`d1`, `h1`–`h6` headings, `s1`–`s3` subtitles/body, `i1`–`i3` interface text) + weight (`t/xl/l/r/m/s/b` = 100–700) + family (`d` = Roboto Condensed, `a` = Montserrat)
- The scale lives in `assets/styles/utils/typography.scss` as the `$typography` map (font-size / line-height / letter-spacing per style, desktop + mobile); classes are generated from it — never hardcode font-size/line-height in components
- Mobile sizes apply automatically inside the generated classes below the `md` breakpoint
- Apply the class to the text tag (`<p>`, `<h*>`, `<span>`) inside a BEM wrapper; the semantic tag and the visual style are independent (`<h2 class="h3-l-d">` is fine)
- Never apply a typography class to a component root, control, or layout container. Put it on the inner text node (`button > span`, link text, menu-item text); reusable controls expose a `textClass` prop when callers need a variant
- Geometry written with `em($px)` must keep the base `16px` context. Do not use `em($px, $fontSize)` to compensate for typography on a container; the context argument is reserved for elements that cannot contain a text wrapper, such as `<input>`
- All CMS/user-facing text is piped through `$tp()` (typograf: non-breaking spaces, quotes, dashes); translations via `useT()` returning the key itself when no translation exists

## Data layer

- Strapi: `useStrapi()` (`findOne`, `create`) or `useStrapiRequest` / `useCollectionRequest` composables; populate lists centralized in `configs/populates.js`, composed by spread: `[...SEO_POPULATE, ...pagePopulate]`
- Custom APIs: `useRequest(url, options, apiVersion)` — `$fetch` wrapper resolving baseURL per `API_VERSIONS` and server/client context
- Network calls live in Pinia store actions; components call `store.sendLeadsData(data)`
- Stores: options syntax — `defineStore('name', { state: () => ({...}), actions: {...} })`
- CMS response → props adaptation: pure functions in `adapters/`, not inside components
- Page errors: `throw createError({ status: 404, message: 'Page Not Found', fatal: true })`

## Forms

- `<VeeForm v-slot="{ failed }" @submit="onSubmit(close)">` + `UiInput` / `UiPhoneInput` / `UiCheckbox` with string rules: `rules="required|email"`. Custom rules in `plugins/validator.js`; yup schemas for complex cases
- Submit button: `:disabled="failed || isLoading"`
- After submit: open `LazyModalsStatus`

## Utils, composables, plugins

- Utils: pure functions with full JSDoc (`@param`, `@returns`, `@example`)
- Composables: one export per file — `export const useX = () => {...}`, JSDoc header with `@description`
- Constants: UPPER_SNAKE_CASE dictionary objects, lowercase string values (`BUTTON_SIZE.XS = 'xs'`)
- Nuxt plugins: `defineNuxtPlugin({ parallel: true, setup() { return { provide: {...} } } })`; suffix `.client.js` / `.server.js` when environment-specific

## Naming

| What                | Style                | Example                            |
| ------------------- | -------------------- | ---------------------------------- |
| Component files     | PascalCase           | `Button.vue`, `ModalsCallback.vue` |
| CSS classes         | kebab-case BEM       | `ui-button__icon--left`            |
| Variables/functions | camelCase            | `computedTarget`                   |
| Event handlers      | `on` + event         | `onActiveChange`, `onSubmit`       |
| Constants           | UPPER_SNAKE_CASE     | `BUTTON_THEME`, `API_VERSIONS`     |
| Composables         | `use` + PascalCase   | `useStrapiRequest`                 |
| Boolean props/refs  | `is` / `with` prefix | `isLarge`, `withTag`               |

## Do NOT

- No Tailwind, styled-components, CSS modules
- No `lang="ts"` in `.vue` components — TS belongs in stores/configs/composables/utils
- No hardcoded colors or px sizes, no inline styles
- No fetch inside components — go through stores/composables
- No new dependencies when @vueuse, the UI kit, or existing utils cover it
- No local string literals for themes/sizes — use `configs/` dictionaries
- No raw `<a>`, `<img>`, inline SVG when `CLinkTag` / `CImage` / `CIcon` cover the case
- Never omit `:key` in `v-for`, `aria-label` on icon-only interactive elements, `draggable="false"` on card overlay links
