# create-fumandocs

Scaffold a [Fumadocs](https://fumadocs.dev) site that uses
[Mantine](https://mantine.dev) as the UI layer — no Tailwind CSS. Pick the
`docs` and/or `blog` module when prompted.

## Usage

```bash
npx create-fumandocs my-docs
cd my-docs
npm run dev
```

Open http://localhost:3000/docs (docs) or http://localhost:3000/blog (blog).

### Options

```text
create-fumandocs [name] [options]

Arguments:
  name           project directory name

Options:
  --modules <list>      modules to include, comma separated: docs,blog (default: docs)
  --title <text>        site title (defaults to the project name)
  --description <text>  site description
  --url <url>           public site URL (default: https://example.com)
  --install             install dependencies after scaffolding
  --pm <name>           package manager (npm, yarn, bun, pnpm)
```

With no arguments the CLI asks for a project name, modules, site title,
description, URL, and package manager interactively. The docs module is selected
by default and the blog module is off; selecting neither exits without writing
anything. License files are left to you. The CLI does not initialise a Git
repository; the final instructions print `git init`. In CI (`CI=1`) it scaffolds
`my-docs` with the docs module and default site metadata non-interactively,
without installing dependencies.

## Modules

- **docs** — MDX documentation under `content/docs/`, served at `/docs` with a
  page tree, search, and Markdown output.
- **blog** — MDX posts under `content/blog/`, served as a post list at `/blog`
  with titles, dates, descriptions, and tags.

## What you get

A Next.js App Router project with:

- `fumandocs-ui` (Mantine) for the docs layout, MDX components, and search
- `fumadocs-core` + `fumadocs-mdx` for content, routing, and page trees
- Content in `content/docs/` and/or `content/blog/` (MDX), site config in `app/`
- `.env.example` with `NEXT_PUBLIC_SITE_URL`, used by `robots.ts` and
  `sitemap.ts`, and an optional `NEXT_PUBLIC_REPO_URL` for the GitHub links

## Requirements

- Node.js >= 22

## License

MIT
