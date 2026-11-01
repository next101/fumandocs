import { Badge, Group } from '@mantine/core'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PageActions,
  ViewOptionsPopover,
} from 'fumandocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumandocs-ui/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { blogSource, formatDate, getPosts } from '@/lib/blog'
import classes from './page.module.css'

export const dynamicParams = false

export default async function Page(props: PageProps<'/blog/[...slug]'>) {
  const params = await props.params
  const page = blogSource.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const markdownUrl = `/llms.mdx/blog/${page.slugs.join('/')}/content.md`

  return (
    <DocsPage
      toc={page.data.toc}
      footer={{ enabled: false }}
      className={classes.article}
    >
      <Link href="/blog" className={classes.back}>
        ← All posts
      </Link>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <Group gap={8} c="dimmed" fz="sm">
        <time dateTime={page.data.date.toISOString()}>
          {formatDate(page.data.date)}
        </time>
        {page.data.tags.map((tag) => (
          <Badge key={tag} variant="default" size="sm" tt="none" fw={500}>
            {tag}
          </Badge>
        ))}
      </Group>
      <PageActions>
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} />
      </PageActions>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(blogSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slugs }))
}

export async function generateMetadata(
  props: PageProps<'/blog/[...slug]'>
): Promise<Metadata> {
  const params = await props.params
  const page = blogSource.getPage(params.slug)
  if (!page) return {}
  return {
    title: page.data.title,
    description: page.data.description,
  }
}
