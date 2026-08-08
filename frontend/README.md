# Nuxt 4 + Strapi starter

Content-driven frontend built with Nuxt 4, Vue 3, Pinia and Strapi.
Pages and reusable blocks are loaded from Strapi through the catch-all route.

Code conventions are mandatory and live in [CODESTYLE.md](./CODESTYLE.md).

## Localization

The default locale is prefix-less (`/about`), others are prefixed (`/en/about`).

- `plugins/init.server.ts` resolves the locale from the URL against
  `/api/i18n/locales`, then fetches layout, pages, initial and translations for
  it — falling back to the default locale entry whenever Strapi returns nothing
  for the requested one.
- `middleware/i18n.global.ts` strips a redundant default-locale prefix.
- `$t('key', 'fallback')` (`plugins/translate.ts`) reads the `translation`
  single type from the global store; add keys in Strapi, not in the repo.
- `utils/locale.ts` holds `getRouteLocale` / `stripRouteLocale`.

## Structure

- `components/` — shared, layout, UI and content block components
- `composables/` — Strapi requests, SEO, routing and browser helpers
- `configs/` — block and populate definitions
- `layouts/` and `pages/` — application shell and dynamic pages
- `plugins/` — initial data, validation, formatting and browser integrations
- `server/` — robots and sitemap endpoints
- `stores/` — Pinia state
- `assets/styles/` — global SCSS

## Requirements

- Node.js 22.13+ (or another version supported by `package.json`)
- pnpm 11.11.0+
- A Strapi v5 API

## Development

```bash
pnpm install
pnpm dev
```

The development server listens on port `3000` by default. Configure the
Strapi and site URLs with `NUXT_SERVER_URL`, `NUXT_CLIENT_URL` and
`NUXT_SITE_URL`.

## Checks

```bash
pnpm lint
pnpm stylelint "**/*.{css,scss,vue}"
pnpm typecheck
pnpm test
pnpm build
```
