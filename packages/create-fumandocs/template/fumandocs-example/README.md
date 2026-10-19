This is a Next.js documentation site generated with **create-fumandocs**, using
Mantine as the Fumadocs UI layer.

## Run locally

```bash
npm run dev
```

Open http://localhost:3000/docs.

## UI setup

No Tailwind CSS or PostCSS. Styles are pulled in via CSS `@import` in
`app/global.css`:

```css
@import "@mantine/core/styles.css";
@import "fumandocs-ui/style.css";
```

Customize Mantine via `RootProvider` in `app/layout.tsx` — the scaffold uses
Mantine's `dark` palette as the primary color.

## Landing page

The home page (`app/page.tsx`) is a Mantine-styled landing composed from
components in `components/home/`: a hero with an animated terminal preview,
feature cards, a get-started command with copy button, and a scroll-reveal
footer. Restyle them freely, or remove the landing and point users straight at
`/docs`.
