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

import { highlight } from 'fumadocs-core/highlight'
import { CodeBlock } from 'fumandocs-ui/components/codeblock'
import type { ReactNode } from 'react'

type HighlightLang = Parameters<typeof highlight>[1]['lang']

const themes = {
  light: 'github-light',
  dark: 'github-dark',
} as const

export async function ShikiCodeBlockServer({
  code,
  lang = 'bash',
  title,
}: {
  code: string
  lang?: HighlightLang
  title?: ReactNode
}) {
  const highlighted = await highlight(code, {
    lang,
    themes,
    defaultColor: false,
  })
  return <CodeBlock title={title}>{highlighted}</CodeBlock>
}
