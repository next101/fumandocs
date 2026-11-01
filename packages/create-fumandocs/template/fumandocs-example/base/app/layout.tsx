import { ColorSchemeScript } from '@mantine/core'
import { RootProvider } from 'fumandocs-ui/provider/next'
import type { Metadata, Viewport } from 'next'
import { brandName } from '@/components/logo'
import { siteDescription } from '@/lib/site'
import './global.css'

export const metadata: Metadata = {
  title: {
    default: brandName,
    template: `%s | ${brandName}`,
  },
  description: siteDescription,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1b1e' },
  ],
}

export default function Layout({ children }: LayoutProps<'/'>) {
  // Reserve the scrollbar gutter so the sticky header does not shift between
  // short and long pages.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ scrollbarGutter: 'stable' }}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <RootProvider theme={{ primaryColor: 'gray', defaultRadius: 'xs' }}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
