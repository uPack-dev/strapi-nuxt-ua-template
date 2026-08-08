# Backend — Strapi 5

Headless CMS for the site, built on **Strapi 5** (TypeScript). Ships a
CMS-driven page model (dynamic-zone blocks), a Ukrainian admin locale and i18n
wired end-to-end, plus a Docker image and a GHCR + Dokploy deploy workflow.

- Framework: Strapi `5.50.1`, Node `>=20 <=26`, pnpm `>=10`
- Default database: SQLite (`.tmp/data.db`); MySQL and PostgreSQL via env
- Frontend: the Nuxt app in `../frontend`

## Quick start

```bash
pnpm install --frozen-lockfile
cp .env.example .env   # then fill in the secrets
pnpm dev
```

Admin panel: <http://localhost:1337/admin>. On first run Strapi asks you to
create an admin user.

Then, in the admin:

1. **Settings → Internationalization** — add the locales you need. Ukrainian
   (`uk`) is normally the default; add `en` and any others as secondary.
2. **Settings → Users & Permissions → Roles → Public** — enable `find` /
   `findOne` for `page`, `layout`, `global`, `initial`, `translation`,
   `contact`, `social`, and `create` for `lead`. The frontend reads them
   unauthenticated.
3. Fill **Макет** (layout), **Початкові налаштування** (initial) and create at
   least one **Сторінка** with `slug: main` — the frontend maps `main` to `/`.

## Environment

Copy `.env.example` to `.env` and replace every placeholder. All values in
`.env.example` are development defaults — **none of the secrets are safe for
production**.

| Variable | Purpose |
| --- | --- |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | Strapi secrets. Regenerate for every environment. |
| `HOST`, `PORT` | Strapi bind address (default `0.0.0.0:1337`). |
| `DATABASE_*` | See [Database](#database). |

## Data model

Everything is localized through Strapi's i18n plugin — content types and the
attributes inside them carry `pluginOptions.i18n.localized`. The frontend picks
the locale from the URL prefix and falls back to the default locale whenever a
translation is missing, so a partially translated site still renders.

| Content type | Kind | Purpose |
| --- | --- | --- |
| `page` | collection | A page: `slug` + a `blocks` dynamic zone + SEO. |
| `global` | collection | Reusable block groups, referenced by `blocks.reusable`. |
| `layout` | single | Header and footer content. |
| `initial` | single | Site-wide SEO defaults, `robots`, redirects. |
| `translation` | single | UI string dictionary consumed by the frontend `$t()`. |
| `contact` | collection | Phones, emails, addresses for header/footer. |
| `social` | collection | Social links. |
| `lead` | collection | Form submissions (public `create`). |

Components:

- `blocks.template-block` — copy this to start a new block.
- `blocks.reusable` — embeds a `global` entry into a page.
- `global.section-data` — per-section padding/background, read by the
  frontend's `CSectionWrapper`.
- `global.seo`, `layout.header`, `layout.footer`, `layout.menu-links`,
  `layout.sub-menu-links`, `layout.redirect`, `components.developer`,
  `components.list-item`.
- `ui.knopka` (button), `ui.posilannya` (link), `ui.zobrazhennya` (image) —
  named in Ukrainian on purpose: the display name is what editors see, and
  Strapi derives it from the file name.

### Adding a block

1. Create `src/components/blocks/<name>.json` (copy `template-block.json`).
2. Add `"blocks.<name>"` to the `blocks` dynamic zone in
   `src/api/page/content-types/page/schema.json`.
3. On the frontend: add `app/blocks/<Name>.vue`, register it in
   `app/configs/blocks.ts`, and add its populate entry in
   `app/configs/populates.ts`.

## Database

Defaults to SQLite at `.tmp/data.db`. To switch, set `DATABASE_CLIENT` to
`mysql` or `postgres` and provide the connection env (`DATABASE_URL` **or** the
discrete `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_NAME` /
`DATABASE_USERNAME` / `DATABASE_PASSWORD`, plus optional `DATABASE_SSL*`). See
`config/database.ts`.

The production image is pruned to prod dependencies and only ships `mysql2` —
`better-sqlite3` is a devDependency. Set `DATABASE_CLIENT` explicitly in prod or
Strapi falls back to sqlite and crashes with `Cannot find module 'better-sqlite3'`.

SQLite connections get `journal_mode = WAL` and `synchronous = NORMAL` — see the
comment in `config/database.ts` for why.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` / `pnpm develop` | Strapi in watch mode. |
| `pnpm build` | `strapi build` (admin panel + server). |
| `pnpm start` | `strapi start` (production). |
| `pnpm upgrade` / `pnpm upgrade:dry` | Run the Strapi upgrade tool. |

## Project structure

```
config/                 Strapi config (server, database, plugins, middlewares, admin, api)
database/migrations/    knex migrations, applied on boot
patches/                pnpm patch for @strapi/design-system (see below)
src/
  index.ts              register/bootstrap hooks
  admin/                admin customisation: uk locale, logo
  api/                  content types
  components/           reusable component schemas
types/generated/        written by Strapi on every boot — empty until the first `pnpm dev`
```

`patches/@strapi__design-system@2.2.2.patch` fixes a crash in the admin JSON
field: the design-system dist inlines its own `@codemirror/state` while creating
the editor via the external `@uiw/react-codemirror`, so a `StateField`
`instanceof` check fails and the edit view dies. `pnpm-workspace.yaml` pins
design-system to `2.2.2` so the patch keeps applying — bump both together.

## Deployment

`Dockerfile` builds a single-container image; `.github/workflows/backend-dokploy-dev.yml`
(at the repo root) builds it on every push to `dev`, pushes it to GHCR and pings
a Dokploy webhook.

1. Set the repository secret `DOKPLOY_WEBHOOK_URL` (optional — without it the
   image is only pushed).
2. In Dokploy, create an application from the GHCR image, copy every variable
   from `.env.example` into its environment and replace the placeholders.
3. Mount persistent volumes at `/opt/app/.tmp` (SQLite database) and
   `/opt/app/public/uploads` (media). Without the second one, every deploy drops
   the uploaded files.
4. The container runs as root so it can write to platform-mounted volumes — see
   the `ponytail:` note in the `Dockerfile` if you need to drop privileges.

The image exposes `1337` and has a healthcheck on `/_health`.
