import { brandName } from '@/components/logo'
import { getPosts } from '@/lib/blog'
import { siteDescription, siteUrl } from '@/lib/site'

export const revalidate = false

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function GET() {
  const blogUrl = escapeXml(`${siteUrl}/blog`)
  const items = getPosts()
    .map((post) => {
      const url = escapeXml(`${siteUrl}${post.url}`)
      const categories = post.data.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return `  <item>
    <title>${escapeXml(post.data.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${post.data.date.toUTCString()}</pubDate>
    <description>${escapeXml(post.data.description)}</description>${categories ? `\n${categories}` : ''}
  </item>`
    })
    .join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(brandName)}</title>
  <link>${blogUrl}</link>
  <description>${escapeXml(siteDescription)}</description>
  <language>en</language>
${items}
</channel>
</rss>
`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  )
}
