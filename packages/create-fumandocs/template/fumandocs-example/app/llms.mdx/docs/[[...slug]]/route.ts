import { notFound } from 'next/navigation'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET(
  _request: Request,
  { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>
) {
  const { slug } = await params
  const page = source.getPage(slug?.slice(0, -1))
  if (!page) notFound()

  return new Response(await page.data.getText('processed'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [...page.slugs, 'content.md'],
  }))
}
