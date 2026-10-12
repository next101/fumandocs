# Fumandocs website (`fumandocs-www`)

Official demo and documentation for the Fumandocs project.

## Run locally

From the monorepo root:

```bash
pnpm dev:site
```

Or from this directory (`pnpm dev` rebuilds `fumandocs-ui` first):

```bash
pnpm dev
```

Open http://localhost:3000 for the landing page and http://localhost:3000/docs
for documentation.

## Deployment

Set the `SITE_URL` environment variable to the public origin (for example
`https://docs.example.com`). It feeds `metadataBase`, OpenGraph URLs,
`sitemap.xml`, and `robots.txt`; when unset, everything falls back to
`http://localhost:3000`, which is only correct for local development.

## Content

- `content/docs/` — MDX pages and `meta.json` sidebar
- Depends on workspace **`fumandocs-ui`** (direct imports, no npm alias)
