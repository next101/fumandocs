import { DocsLayout } from 'fumandocs-ui/layouts/docs'
import { source } from '@/lib/source'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} nav={{ title: '__PROJECT_NAME__' }}>
      {children}
    </DocsLayout>
  )
}
