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

import '@testing-library/jest-dom/vitest'
import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import defaultMdxComponents, { createRelativeLink } from './mdx'

const components = defaultMdxComponents

function renderMdx(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('defaultMdxComponents', () => {
  it.each([
    ['h1', 1],
    ['h2', 2],
    ['h3', 3],
    ['h4', 4],
    ['h5', 5],
    ['h6', 6],
  ] as const)('maps %s to a level %i heading', (tag, level) => {
    const Heading = components[tag]

    renderMdx(<Heading>Title</Heading>)

    expect(screen.getByRole('heading', { level })).toHaveTextContent('Title')
  })

  it('wraps pre in a code block figure', () => {
    const Pre = components.pre

    const { container } = renderMdx(<Pre>code</Pre>)

    expect(container.querySelector('figure pre')).not.toBeNull()
  })

  it('wraps tables in a scroll container', () => {
    const Table = components.table

    renderMdx(
      <Table>
        <tbody>
          <tr>
            <td>cell</td>
          </tr>
        </tbody>
      </Table>
    )

    expect(screen.getByRole('table').parentElement?.tagName).toBe('DIV')
  })

  it('renders images with responsive sizes', () => {
    const Image = components.img

    renderMdx(<Image src="/logo.png" alt="Logo" />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/logo.png')
    expect(image).toHaveAttribute('sizes')
  })

  it('renders anchors as links', () => {
    const Anchor = components.a

    renderMdx(<Anchor href="/docs">Docs</Anchor>)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/docs')
  })

  it('maps callout and card collections', () => {
    expect(components.Callout).toBeTypeOf('function')
    expect(components.CalloutTitle).toBeTypeOf('function')
    expect(components.CalloutDescription).toBeTypeOf('function')
    expect(components.Card).toBeTypeOf('function')
    expect(components.Cards).toBeTypeOf('function')
    expect(components.CodeBlockTabs).toBeTypeOf('function')
    expect(components.CodeBlockTab).toBeTypeOf('function')
  })
})

describe('createRelativeLink', () => {
  it('throws in a client environment', () => {
    const call = createRelativeLink as unknown as () => unknown

    expect(() => call()).toThrow(/server environment/)
  })
})
