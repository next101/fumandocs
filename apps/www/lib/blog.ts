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
