import { loader } from 'fumadocs-core/source'
import { defineCollections } from 'fumadocs-mdx/macro'
import { z } from 'zod'

const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  // Powers the "View as Markdown" action and /llms.mdx/blog/*.
  postprocess: { includeProcessedMarkdown: true },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
})

export function getPosts() {
  return blogSource
    .getPages()
    .filter(
      (post) => process.env.NODE_ENV === 'development' || !post.data.draft
    )
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(date)
}
