# fumandocs-ui

Mantine UI for [Fumadocs](https://fumadocs.dev): docs layout, page primitives,
provider, search, and MDX components — no Tailwind CSS.

## Install

```bash
pnpm add fumandocs-ui @mantine/core @mantine/hooks fumadocs-core fumadocs-mdx
```

Import from **`fumandocs-ui/...`**. Upstream Fumadocs docs use the name
`fumadocs-ui`; swap the package name for the subpaths we support (see the
Fumandocs site export-compatibility page).

## Root layout (Next.js)

```tsx
import "@mantine/core/styles.css";
import "fumandocs-ui/style.css";
import { ColorSchemeScript } from "@mantine/core";
import { RootProvider } from "fumandocs-ui/provider/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

See the Fumandocs monorepo `apps/www` for a full site (`pnpm dev:site` from the
root).
