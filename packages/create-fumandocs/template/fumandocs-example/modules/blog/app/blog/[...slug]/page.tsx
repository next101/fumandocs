import { Badge, Container, Group, Text, Title } from '@mantine/core'
import { DocsBody } from 'fumandocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumandocs-ui/mdx'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { blogSource, formatDate, getPosts } from '@/lib/blog'
import classes from './page.module.css'

export default async function Page(props: PageProps<'/blog/[...slug]'>) {
  const params = await props.params
  const page = blogSource.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <Container size={760} py={{ base: 56, md: 88 }}>
      <article>
        <Link href="/blog" className={classes.back}>
          ← All posts
        </Link>
        <header className={classes.header}>
          <Title order={1} className={classes.title}>
            {page.data.title}
          </Title>
          <Text size="lg" c="dimmed" className={classes.description}>
            {page.data.description}
          </Text>
          <Group gap={8} c="dimmed" fz="sm">
            <time dateTime={page.data.date.toISOString()}>
              {formatDate(page.data.date)}
            </time>
            {page.data.tags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                size="sm"
                radius="sm"
                tt="none"
                fw={500}
              >
                {tag}
              </Badge>
            ))}
          </Group>
        </header>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(blogSource, page),
            })}
          />
        </DocsBody>
      </article>
    </Container>
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
