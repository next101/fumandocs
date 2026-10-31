import { BlogShell } from '@/components/blog/blog-shell'

export default function BlogLayout({ children }: LayoutProps<'/blog'>) {
  return <BlogShell>{children}</BlogShell>
}
