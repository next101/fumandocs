# create-fumandocs

Scaffold a [Fumadocs](https://fumadocs.dev) documentation site that uses
[Mantine](https://mantine.dev) as the UI layer — no Tailwind CSS.

## Usage

```bash
npx create-fumandocs my-docs
cd my-docs
npm run dev
```

Open http://localhost:3000/docs.

### Options

```text
create-fumandocs [name] [options]

Arguments:
  name         project directory name

Options:
  --install    install dependencies after scaffolding
  --no-git     skip git init
  --pm <name>  package manager for --install (npm, yarn, bun, pnpm)
```

With no arguments the CLI asks for a project name interactively; pass `name` to
skip straight to the install prompt. In CI (`CI=1`) it scaffolds `my-docs`
non-interactively without installing.

## What you get

A Next.js App Router project with:

- `fumandocs-ui` (Mantine) for the docs layout, MDX components, and search
- `fumadocs-core` + `fumadocs-mdx` for content, routing, and page trees
- Content in `content/docs/` (MDX), site config in `app/`

## Requirements

- Node.js >= 22

## License

MIT
