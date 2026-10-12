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

Customize Mantine via `RootProvider` in `app/layout.tsx`.
