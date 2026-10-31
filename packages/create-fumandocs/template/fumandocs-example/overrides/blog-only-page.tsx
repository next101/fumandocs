import { BlogIndex } from '@/components/blog/blog-index'
import { BlogShell } from '@/components/blog/blog-shell'

export default function HomePage() {
  return (
    <BlogShell>
      <BlogIndex />
    </BlogShell>
  )
}
