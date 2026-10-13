# syntax=docker/dockerfile:1

# Deployment image for apps/www — the Fumandocs docs site.
#
# The build context MUST be the repository root: apps/www consumes the
# workspace package `fumandocs-ui`, so the lockfile and every workspace
# manifest have to be in scope, and `fumandocs-ui` is built inside the image.
#
# Shape mirrors ~/work/next101/next101: multi-stage, full production
# node_modules + `next start` (no `output: 'standalone'` in v1 — see
# docs/deploy-dokploy.md for the upgrade path).

# --- 1) base: Node + pnpm -------------------------------------------------
# pnpm is pinned to the same version as .github/workflows/{test,publish}.yml;
# keep it in sync with pnpm-lock.yaml (lockfile v9).
FROM node:24-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g pnpm@11.13.0

# --- 2) deps: install from the lockfile -----------------------------------
# Only manifests are copied, so this layer stays cached until the lockfile or a
# package.json changes. Every workspace project needs its manifest present or
# `--frozen-lockfile` cannot reconcile the importers.
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/www/package.json apps/www/
COPY packages/create-fumandocs/package.json packages/create-fumandocs/
COPY packages/fumandocs-ui/package.json packages/fumandocs-ui/
COPY packages/tsconfig/package.json packages/tsconfig/
# --ignore-scripts: nothing in this install needs one. No dependency has a real
# build script (esbuild's only validates the prebuilt platform binary that ships
# as an optional dependency), and the root `prepare` hook — `lefthook install`,
# which wants a git work tree this build context does not carry — is skipped
# along with them.
RUN pnpm install --frozen-lockfile --ignore-scripts

# --- 3) runner: source + build + production start -------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# The installed workspace, exactly as `deps` left it. pnpm's isolated linker gives
# *every* project its own node_modules (apps/www/, packages/fumandocs-ui/,
# packages/create-fumandocs/), and the symlinks inside those point back at the
# root's `.pnpm/` — so the whole tree has to come along. Copying the root alone
# leaves the projects without the modules their scripts resolve against, which is
# what made pnpm re-install (and die on `prepare`) inside the build layer.
# `deps` holds nothing but the manifests and these installed trees, so copying
# whole directories cannot drag in anything else.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages

COPY . .

# SITE_URL is baked into the prerendered output (metadataBase, OpenGraph URLs,
# sitemap.xml, robots.txt), so it is a build arg: changing the public origin
# means rebuilding the image.
ARG SITE_URL=http://localhost:3000
ENV SITE_URL=$SITE_URL

# Builds packages/fumandocs-ui first (the www `build` script does that), then
# the Next.js site. `.source/` (fumadocs-mdx codegen) is regenerated here — it
# is not committed, exactly as on CI.
#
# `pnpm_config_verify_deps_before_run=false` turns off the pre-run dependency
# check pnpm ≥11 does before *any* script: it stats the tree against the lockfile
# and, when it disagrees, runs its own `pnpm install` — which does not inherit
# `--ignore-scripts`, so it ends in the root `prepare` hook. That is the install
# that failed the first Dokploy build (no store to reuse in this stage, and no
# git for lefthook). The tree above is already what `deps` produced; the check has
# nothing to add here, and a real problem surfaces as a missing module below.
RUN pnpm_config_verify_deps_before_run=false pnpm --filter fumandocs-www build

RUN groupadd --system --gid 1001 fumandocs \
  && useradd --system --uid 1001 --gid fumandocs fumandocs \
  && chown -R fumandocs:fumandocs /app

USER fumandocs

# `next start` needs apps/www as its working directory, and the exec-form CMD
# keeps it as PID 1 so it receives SIGTERM directly.
WORKDIR /app/apps/www
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start"]
