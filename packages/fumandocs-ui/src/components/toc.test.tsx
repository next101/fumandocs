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
import { act, render, screen } from '@testing-library/react'
import { AnchorProvider } from 'fumadocs-core/toc'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TOCRail, TOCRailItem } from './toc'

const tocState = vi.hoisted(() => ({
  items: [] as unknown[],
  listener: null as null | ((items: unknown[]) => void),
}))

vi.mock('fumadocs-core/toc', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fumadocs-core/toc')>()
  return {
    ...actual,
    useTOC: () => ({ get: () => tocState.items }),
    useTOCListener: (listener: (items: unknown[]) => void) => {
      tocState.listener = listener
    },
  }
})

function activeRange(step?: number): unknown[] {
  return [
    {
      id: '#one',
      active: true,
      t: 1,
      original: { url: '#one', title: 'One', depth: 2, _step: step },
    },
    {
      id: '#two',
      active: true,
      t: 2,
      original: { url: '#two', title: 'Two', depth: 3 },
    },
  ]
}

const items = [
  { url: '#one', title: 'One', depth: 2 },
  { url: '#two', title: 'Two', depth: 3 },
  { url: '#three', title: 'Three', depth: 4 },
]

class ImmediateResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}
  observe() {
    this.callback([], this as unknown as ResizeObserver)
  }
  unobserve() {}
  disconnect() {}
}

function renderRail(thumbBox?: boolean, toc = items) {
  return render(
    <AnchorProvider toc={toc}>
      <TOCRail items={toc} thumbBox={thumbBox}>
        {toc.map((item) => (
          <TOCRailItem key={item.url} item={item} items={toc} />
        ))}
      </TOCRail>
    </AnchorProvider>
  )
}

beforeEach(() => {
  tocState.items = []
  tocState.listener = null
  globalThis.ResizeObserver =
    ImmediateResizeObserver as unknown as typeof ResizeObserver
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockReturnValue(0)
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    paddingTop: '4px',
    paddingBottom: '4px',
    getPropertyValue: (name: string) =>
      name.startsWith('padding') ? '4px' : '',
  } as unknown as CSSStyleDeclaration)
  // jsdom has no SVGPathElement, but createElementNS returns an SVGElement.
  Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
    value: () => 100,
    configurable: true,
  })
  Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
    value: (length: number) => ({ x: 0, y: length }),
    configurable: true,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('TOCRail', () => {
  it('draws a rail path once measured', () => {
    const { container } = renderRail()

    expect(container.querySelector('path')).not.toBeNull()
  })

  it('omits the thumb dot when thumbBox is disabled', () => {
    const { container } = renderRail(false)

    expect(container.querySelector('path')).not.toBeNull()
    expect(container.querySelector('[style*="offset-path"]')).toBeNull()
  })

  it('renders a moving thumb dot by default', () => {
    const { container } = renderRail()

    expect(container.querySelector('[style*="offset-path"]')).not.toBeNull()
  })

  it('renders nothing to measure for an empty toc', () => {
    const { container } = renderRail(true, [])

    expect(container.querySelector('path')).toBeNull()
  })
})

describe('TOCRailItem', () => {
  it('renders the item as a link', () => {
    renderRail()

    expect(screen.getByRole('link', { name: 'One' })).toHaveAttribute(
      'href',
      '#one'
    )
  })

  it('handles depth transitions between neighbours', () => {
    renderRail()

    expect(screen.getAllByRole('link')).toHaveLength(3)
  })
})

describe('thumb track', () => {
  it('positions the thumb for the active range', () => {
    tocState.items = activeRange()

    const { container } = renderRail()

    const thumb = container.querySelector(
      '[style*="--track-top"]'
    ) as HTMLElement
    expect(thumb).not.toBeNull()
    expect(thumb.style.getPropertyValue('--track-top')).not.toBe('')
  })

  it('applies listener updates to the thumb element', () => {
    tocState.items = activeRange()
    renderRail()

    act(() => tocState.listener?.(tocState.items))

    const thumb = document.querySelector(
      '[style*="--track-top"]'
    ) as HTMLElement
    expect(thumb.style.getPropertyValue('--offset-distance')).not.toBe('')
  })

  it('tracks direction and step markers', () => {
    tocState.items = activeRange(1)
    renderRail()

    const thumb = document.querySelector(
      '[style*="--track-top"]'
    ) as HTMLElement
    act(() => tocState.listener?.(tocState.items))
    expect(thumb.style.getPropertyValue('--opacity')).toBe('1')

    tocState.items = [
      {
        id: '#one',
        active: true,
        t: 1,
        original: { url: '#one', title: 'One', depth: 2, _step: 1 },
      },
      {
        id: '#two',
        active: false,
        t: 2,
        original: { url: '#two', title: 'Two', depth: 3 },
      },
    ]
    act(() => tocState.listener?.(tocState.items))
    expect(thumb.style.getPropertyValue('--opacity')).toBe('0')
  })

  it('skips thumb bookkeeping when thumbBox is disabled', () => {
    tocState.items = activeRange()

    renderRail(false)
    act(() => tocState.listener?.(tocState.items))

    expect(tocState.listener).not.toBeNull()
  })

  it('ignores listener updates after unmount', () => {
    tocState.items = activeRange()
    const { unmount } = renderRail()
    const listener = tocState.listener

    unmount()
    act(() => listener?.(tocState.items))
  })
})

describe('TOCRail measurement', () => {
  it('skips items that have no rendered anchor', () => {
    render(
      <AnchorProvider toc={[]}>
        <TOCRail items={[{ url: '#missing', title: 'Missing', depth: 2 }]} />
      </AnchorProvider>
    )
  })
})
