import { ColorSchemeScript } from '@mantine/core'
import { RootProvider } from 'fumandocs-ui/provider/next'
import './global.css'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <RootProvider
          theme={{ primaryColor: 'gray', defaultRadius: 'xs' }}
          mantine={{ defaultColorScheme: 'dark' }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
