/**
 * MIT License
 *
 * Copyright (c) 2026 Xiao Hanyu (https://xiaohanyu.me)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

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
