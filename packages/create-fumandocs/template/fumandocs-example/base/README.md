This is a Next.js site generated with **create-fumandocs**, using Mantine as the
Fumadocs UI layer.

## Run locally

```bash
npm run dev
```

<!-- @modules docs -->

Open http://localhost:3000/docs.
<!-- @modules-end -->
<!-- @modules blog -->

Open http://localhost:3000/blog.
<!-- @modules-end -->

## Modules

<!-- @modules docs -->

### Docs

Write MDX files in `content/docs`. The docs are served at `/docs`, with a page
tree, search index, and Markdown output already wired up.
<!-- @modules-end -->

<!-- @modules blog -->

### Blog

Write posts in `content/blog`. The post list lives at `/blog`, and each post
supports `title`, `description`, `date`, `tags`, and `draft` frontmatter.
<!-- @modules-end -->

## UI setup

No Tailwind CSS or PostCSS. Styles are pulled in via CSS `@import` in
`app/global.css`:

```css
@import "@mantine/core/styles.css";
@import "fumandocs-ui/style.css";
```

Customize Mantine via `RootProvider` in `app/layout.tsx` — the scaffold uses
Mantine's `gray` palette as the primary color.

<!-- @modules docs -->

## Landing page

The home page (`app/page.tsx`) is a Mantine-styled landing composed from
components in `components/home/`: a hero with an animated terminal preview,
feature cards, a get-started command with copy button, and a scroll-reveal
footer. Restyle them freely, or remove the landing and point users straight at
`/docs`.
<!-- @modules-end -->
