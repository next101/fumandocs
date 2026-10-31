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
import { Card, Cards } from './card'

function renderCard(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('Card', () => {
  it('renders a plain card when there is no href', () => {
    renderCard(<Card title="Getting started" />)

    expect(screen.getByText('Getting started')).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders a link when href is supplied', () => {
    renderCard(<Card title="Getting started" href="/docs" />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/docs')
  })

  it('opens external links in a new tab', () => {
    renderCard(<Card title="GitHub" href="https://example.com" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders optional description, icon, and children', () => {
    renderCard(
      <Card
        title="Getting started"
        description="Set up your docs"
        icon={<span data-testid="card-icon" />}
      >
        <span data-testid="card-body" />
      </Card>
    )

    expect(screen.getByTestId('card-icon')).toBeInTheDocument()
    expect(screen.getByTestId('card-body')).toBeInTheDocument()
    expect(screen.getByText('Set up your docs')).toBeInTheDocument()
  })

  it('omits optional parts when not supplied', () => {
    renderCard(<Card title="Getting started" />)

    expect(screen.queryByTestId('card-icon')).toBeNull()
    expect(screen.queryByTestId('card-body')).toBeNull()
  })

  it('groups cards in a simple grid', () => {
    renderCard(
      <Cards>
        <Card title="One" />
        <Card title="Two" />
      </Cards>
    )

    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })
})
