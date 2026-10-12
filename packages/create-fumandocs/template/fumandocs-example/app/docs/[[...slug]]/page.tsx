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
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { source } from '@/lib/source'

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()
  const MDX = page.data.body
  const markdownUrl = `/llms.mdx/docs/${page.slugs.join('/')}${page.slugs.length > 0 ? '/' : ''}content.md`

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription style={{ marginBottom: 0 }}>
        {page.data.description}
      </DocsDescription>
      <PageActions>
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} />
      </PageActions>
      <DocsBody>
        <MDX
          components={getMDXComponents({ a: createRelativeLink(source, page) })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
  const page = source.getPage((await props.params).slug)
  if (!page) notFound()
  return { title: page.data.title, description: page.data.description }
}
