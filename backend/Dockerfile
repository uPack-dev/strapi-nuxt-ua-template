# syntax=docker/dockerfile:1.7
# Single-container Strapi image. Persist a volume at /opt/app/.tmp (SQLite
# database) and at /opt/app/public/uploads (media). See README "Deployment".

FROM node:22-bookworm-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /opt/app

# --- Build: install every dependency, then compile Strapi ---------------------
FROM base AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Manifests first for layer caching. patches/ is required — pnpm applies a
# patched @strapi/design-system during install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN pnpm build && pnpm prune --prod

# --- Runtime ------------------------------------------------------------------
FROM base AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

COPY --from=build /opt/app /opt/app

# ponytail: runs as root so Strapi can write to whatever the platform mounts at
# /opt/app/.tmp (Dokploy volumes are root-owned; a `node` user hits EACCES).
# For a non-root container add an entrypoint that chowns the mount then drops
# to `node` via gosu.
RUN mkdir -p /opt/app/.tmp

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -f http://localhost:1337/_health || exit 1

CMD ["pnpm", "start"]
