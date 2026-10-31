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

import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { Heading } from './heading'

function renderHeading(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('Heading', () => {
  it('renders a plain heading without an anchor when there is no id', () => {
    renderHeading(<Heading>Section</Heading>)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Section')
    expect(heading.querySelector('a')).toBeNull()
    expect(
      screen.queryByRole('link', { name: 'Link to this heading' })
    ).toBeNull()
  })

  it('links to its id when one is provided', () => {
    renderHeading(<Heading id="section">Section</Heading>)

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.querySelector('a')).toHaveAttribute('href', '#section')
    expect(
      screen.getByRole('link', { name: 'Link to this heading' })
    ).toHaveAttribute('href', '#section')
  })

  it('honours the as prop', () => {
    renderHeading(<Heading as="h3">Subsection</Heading>)

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Subsection'
    )
  })

  it('keeps a caller supplied className alongside its own', () => {
    renderHeading(
      <Heading id="section" className="custom">
        Section
      </Heading>
    )

    expect(screen.getByRole('heading', { level: 2 }).className).toContain(
      'custom'
    )
  })
})
