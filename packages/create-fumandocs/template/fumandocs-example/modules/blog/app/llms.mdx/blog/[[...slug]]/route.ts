import { notFound } from 'next/navigation'
import { blogSource, getPosts } from '@/lib/blog'

export const revalidate = false
export const dynamicParams = false

export async function GET(
  _request: Request,
  { params }: RouteContext<'/llms.mdx/blog/[[...slug]]'>
) {
  const { slug } = await params
  const page = blogSource.getPage(slug?.slice(0, -1))
  if (!page) notFound()

  return new Response(await page.data.getText('processed'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export function generateStaticParams() {
  return getPosts().map((post) => ({
    slug: [...post.slugs, 'content.md'],
  }))
}
