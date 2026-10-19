import { ColorSchemeScript } from '@mantine/core'
import { RootProvider } from 'fumandocs-ui/provider/next'
import type { Metadata, Viewport } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: {
    default: 'Documentation',
    template: '%s | Documentation',
  },
  description: 'Documentation built with Fumadocs and Mantine',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1b1e' },
  ],
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <RootProvider theme={{ primaryColor: 'dark', defaultRadius: 'xs' }}>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
