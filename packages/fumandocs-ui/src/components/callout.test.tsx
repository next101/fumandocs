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
import { Callout, CalloutContainer } from './callout'

function renderCallout(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('Callout', () => {
  it('defaults to the info type', () => {
    const { container } = renderCallout(<Callout>Body</Callout>)

    expect(container.querySelector('[data-type]')).toHaveAttribute(
      'data-type',
      'info'
    )
  })

  it('normalizes warn to warning', () => {
    const { container } = renderCallout(<Callout type="warn">Body</Callout>)

    expect(container.querySelector('[data-type]')).toHaveAttribute(
      'data-type',
      'warning'
    )
  })

  it('renders a title when supplied', () => {
    renderCallout(<Callout title="Heads up">Body</Callout>)

    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('omits the title element when no title is supplied', () => {
    renderCallout(<Callout>Body</Callout>)

    expect(screen.queryByText('Heads up')).toBeNull()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('lets a custom icon replace the default one', () => {
    renderCallout(
      <Callout icon={<span data-testid="custom-icon" />}>Body</Callout>
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('keeps a caller supplied className alongside its own', () => {
    const { container } = renderCallout(
      <Callout className="custom">Body</Callout>
    )

    expect(container.querySelector('[data-type]')?.className).toContain(
      'custom'
    )
  })

  it('exposes CalloutContainer as an alias', () => {
    const { container } = renderCallout(
      <CalloutContainer type="success">Body</CalloutContainer>
    )

    expect(container.querySelector('[data-type]')).toHaveAttribute(
      'data-type',
      'success'
    )
  })
})
