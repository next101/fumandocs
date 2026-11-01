import { Container } from '@mantine/core'
import type * as PageTree from 'fumadocs-core/page-tree'
import { DocsLayout } from 'fumandocs-ui/layouts/docs'
import { brandName } from '@/components/logo'
import classes from './layout.module.css'

const blogTree: PageTree.Root = { name: 'Blog', children: [] }

export default function PostLayout({
  children,
}: LayoutProps<'/blog/[...slug]'>) {
  return (
    <Container size="xl">
      <DocsLayout
        tree={blogTree}
        nav={{ enabled: false, title: brandName }}
        sidebar={{ enabled: false }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        containerProps={{ className: classes.layout }}
      >
        {children}
      </DocsLayout>
    </Container>
  )
}
