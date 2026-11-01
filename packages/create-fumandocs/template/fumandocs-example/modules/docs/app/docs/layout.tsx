import { DocsLayout } from 'fumandocs-ui/layouts/docs'
import { brandName } from '@/components/logo'
import { source } from '@/lib/source'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} nav={{ title: brandName }}>
      {children}
    </DocsLayout>
  )
}
