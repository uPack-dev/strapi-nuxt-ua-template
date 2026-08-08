# Nuxt 4 + Strapi 5 template (Ukrainian projects)

GitHub template for CMS-driven marketing sites: a Nuxt 4 frontend and a Strapi 5
backend, wired for Ukrainian-first multilingual content and ready to deploy.

```
frontend/   Nuxt 4 · Vue 3 · Pinia · SCSS
backend/    Strapi 5 (TypeScript)
compose.yaml   dev stack for both
```

## What you get

- **i18n end to end.** Ukrainian is the prefix-less default locale; other locales
  live under `/<code>/`. Every request resolves the locale from the URL and falls
  back to the default locale when a translation is missing, so a partially
  translated site still renders instead of 404-ing.
- **Ukrainian admin.** Strapi admin ships the `uk` locale; content types and
  components are named in Ukrainian, which is what editors actually see.
- **CMS-driven pages.** A page is a dynamic zone of blocks; the frontend renders
  them through `CBlockBuilder` from a registry, lazily and on visibility.
- **UI string dictionary.** The `translation` single type feeds `$t('key',
  'fallback')` on the frontend — no separate locale files to keep in sync.
- **Deploy included.** Backend Dockerfile + GHCR/Dokploy workflow; frontend
  `nixpacks.toml`. SQLite for dev, MySQL/PostgreSQL for prod.
- **Conventions for AI agents.** `frontend/CODESTYLE.md` is the mandatory style
  contract, referenced from `CLAUDE.md` / `AGENTS.md`.

## Quick start

```bash
cd backend  && pnpm install --frozen-lockfile && cp .env.example .env && pnpm dev
cd frontend && pnpm install --frozen-lockfile && cp .env.example .env && pnpm dev
```

Or both at once with `docker compose up` (run `pnpm install` in each folder on
the host first — see the note in `compose.yaml`).

Then follow **Quick start** in [`backend/README.md`](backend/README.md) to create
the admin user, add locales and open up the public read permissions.

## Deployment

Two apps, one repo — so each side must be gated on its own path, or every push
redeploys both.

The repo ships two branches, `main` and `dev`, mirroring the deploy flow: work
lands on `dev`, which is what the workflow watches. **Creating a project from
this template copies only the default branch unless you tick "Include all
branches"** — without `dev` the workflow never fires.

**Backend** — `.github/workflows/backend-dokploy-dev.yml` runs only when
`backend/**` (or the workflow itself) changes on `dev`. It builds the image,
pushes it to GHCR and calls `DOKPLOY_WEBHOOK_URL`. In Dokploy the backend app
must therefore have **auto-deploy off** and rely on that webhook — otherwise its
own git watcher fires a second deploy on frontend-only pushes.

**Frontend** — no workflow. Dokploy builds it from source via
`frontend/nixpacks.toml`. Set the app's **Watch Paths** to `frontend/**`, or
Dokploy rebuilds the frontend whenever the backend changes.

Add a second workflow (copy the backend one, swap the paths filter) if you move
the frontend to a prebuilt image too.

## Renaming the project

1. `name` in `frontend/package.json` and `backend/package.json`.
2. `name:` in `compose.yaml`.
3. `backend/src/admin/extensions/logo.svg` — the admin logo/favicon.
4. Design tokens in `frontend/app/assets/styles/utils/variables.scss` and the
   typography scale in `.../utils/typography.scss`.

The backend generates its own Strapi `uuid` on first `pnpm dev`, and
`backend/types/generated/` is rewritten on every boot — both are intentionally
absent from the template.

## Adding your first block

See **Adding a block** in [`backend/README.md`](backend/README.md): a component
schema, an entry in the page dynamic zone, a `.vue` file, and a line in
`frontend/app/configs/blocks.ts`.

## Fonts

Roboto Condensed (OFL) + Montserrat (OFL), both via `@fontsource`. Nothing that
needs a license. If you swap in a licensed font, check that you may embed it for
web before committing the files.
