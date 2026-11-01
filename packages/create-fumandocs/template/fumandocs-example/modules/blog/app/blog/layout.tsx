import type { Metadata } from 'next'
import { BlogShell } from '@/components/blog/blog-shell'

export const metadata: Metadata = {
  alternates: {
    types: { 'application/rss+xml': '/blog/rss.xml' },
  },
}

export default function BlogLayout({ children }: LayoutProps<'/blog'>) {
  return <BlogShell>{children}</BlogShell>
}
