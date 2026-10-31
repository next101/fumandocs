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
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { RootProvider } from './next'

// fumadocs-core/framework/next imports next/navigation, which only resolves
// inside a Next build. The provider wrapper is what this file tests.
vi.mock('fumadocs-core/framework/next', () => ({
  NextProvider: ({ children }: { children: ReactNode }) => children,
}))

describe('RootProvider (Next)', () => {
  it('renders its children', () => {
    render(
      <RootProvider>
        <span>content</span>
      </RootProvider>
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('forwards custom framework components', () => {
    const Link = vi.fn()

    render(
      <RootProvider components={{ Link: Link as never }}>
        <span>content</span>
      </RootProvider>
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
