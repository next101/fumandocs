import { DocsLayout } from 'fumandocs-ui/layouts/docs'
import { LogoWithTitle } from '@/components/logo'
import { source } from '@/lib/source'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: <LogoWithTitle size={22} /> }}
    >
      {children}
    </DocsLayout>
  )
}
