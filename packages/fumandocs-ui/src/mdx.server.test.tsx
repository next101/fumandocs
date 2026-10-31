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

import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createRelativeLink } from './mdx.server'

function OverrideLink(props: { href?: string }) {
  return (
    <a data-override="" href={props.href}>
      Child page
    </a>
  )
}

function elementFrom(value: unknown, key: string): unknown {
  return (value as ReactElement<Record<string, unknown>>).props[key]
}

describe('createRelativeLink', () => {
  const source = {
    resolveHref: vi.fn((href: string, page: { url: string }) => {
      return `${page.url}/${href}`
    }),
  }
  const page = { url: '/docs' }

  it('resolves relative hrefs against the page', async () => {
    const RelativeLink = createRelativeLink(source as never, page as never)

    const element = await RelativeLink({ href: 'child', children: 'Child' })

    expect(source.resolveHref).toHaveBeenCalledWith('child', page)
    expect(elementFrom(element, 'href')).toBe('/docs/child')
  })

  it('leaves a missing href untouched', async () => {
    const RelativeLink = createRelativeLink(source as never, page as never)

    const element = await RelativeLink({ children: 'Child' })

    expect(elementFrom(element, 'href')).toBeUndefined()
  })

  it('renders through the override link', async () => {
    const RelativeLink = createRelativeLink(
      source as never,
      page as never,
      OverrideLink as never
    )

    const element = await RelativeLink({ href: 'child' })

    expect((element as ReactElement).type).toBe(OverrideLink)
  })
})
