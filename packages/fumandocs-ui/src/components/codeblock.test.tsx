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
import { MantineProvider, Tabs } from '@mantine/core'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from './codeblock'

function renderCodeBlock(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

describe('CodeBlock', () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    writeText.mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
  })

  it('shows a copy button by default', () => {
    renderCodeBlock(<CodeBlock>code</CodeBlock>)

    expect(
      screen.getByRole('button', { name: 'Copy code' })
    ).toBeInTheDocument()
  })

  it.each([false, 'false'] as const)(
    'hides the copy button when allowCopy is %s',
    (allowCopy) => {
      renderCodeBlock(<CodeBlock allowCopy={allowCopy}>code</CodeBlock>)

      expect(screen.queryByRole('button', { name: 'Copy code' })).toBeNull()
    }
  )

  it('shows the copy button when allowCopy is the string "true"', () => {
    renderCodeBlock(<CodeBlock allowCopy="true">code</CodeBlock>)

    expect(
      screen.getByRole('button', { name: 'Copy code' })
    ).toBeInTheDocument()
  })

  it('renders a title as a figcaption', () => {
    renderCodeBlock(<CodeBlock title="app.ts">code</CodeBlock>)

    const caption = screen.getByText('app.ts')
    expect(caption.tagName).toBe('FIGCAPTION')
  })

  it('copies the pre text to the clipboard', async () => {
    renderCodeBlock(
      <CodeBlock>
        <Pre>const answer = 42</Pre>
      </CodeBlock>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))

    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('const answer = 42')
    )
  })

  it('falls back to the viewport text without a pre', async () => {
    renderCodeBlock(<CodeBlock>plain code</CodeBlock>)

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('plain code'))
  })

  it('resets the copied state after a moment', async () => {
    vi.useFakeTimers()
    try {
      renderCodeBlock(
        <CodeBlock>
          <Pre>const answer = 42</Pre>
        </CodeBlock>
      )

      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
      await act(async () => {})
      act(() => vi.advanceTimersByTime(1600))

      expect(writeText).toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('merges viewportProps className into the viewport', () => {
    const { container } = renderCodeBlock(
      <CodeBlock viewportProps={{ className: 'custom-viewport' }}>
        code
      </CodeBlock>
    )

    const viewport = container.querySelector('.custom-viewport')
    expect(viewport).not.toBeNull()
    expect(viewport?.querySelector('pre') ?? null).toBeNull()
  })
})

describe('CodeBlockTabs', () => {
  it('does not leak groupId or persist onto the DOM', () => {
    const { container } = render(
      <MantineProvider>
        <CodeBlockTabs groupId="shared" persist>
          <Tabs.List>
            <Tabs.Tab value="a">A</Tabs.Tab>
          </Tabs.List>
        </CodeBlockTabs>
      </MantineProvider>
    )

    const root = container.firstElementChild as HTMLElement
    expect(root.hasAttribute('groupid')).toBe(false)
    expect(root.hasAttribute('persist')).toBe(false)
  })

  it('renders the tab wrappers', () => {
    render(
      <MantineProvider>
        <CodeBlockTabs defaultValue="a">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="a">A</CodeBlockTabsTrigger>
          </CodeBlockTabsList>
          <CodeBlockTab value="a">Panel A</CodeBlockTab>
        </CodeBlockTabs>
      </MantineProvider>
    )

    expect(screen.getByText('Panel A')).toBeInTheDocument()
  })
})
