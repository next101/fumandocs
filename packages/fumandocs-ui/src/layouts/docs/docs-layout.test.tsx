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
import { fireEvent, render, screen } from '@testing-library/react'
import { FrameworkProvider } from 'fumadocs-core/framework'
import type * as PageTree from 'fumadocs-core/page-tree'
import type { ComponentProps, ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { SearchProvider } from '../../search'
import { DocsLayout, useDocsLayout } from './docs-layout'

const tree: PageTree.Root = {
  name: 'Docs',
  children: [
    { type: 'page', name: 'Introduction', url: '/docs/intro' },
    { type: 'separator', name: 'Guides' },
    {
      type: 'folder',
      name: 'Guide',
      index: { type: 'page', name: 'Guide', url: '/docs/guide' },
      children: [{ type: 'page', name: 'Setup', url: '/docs/guide/setup' }],
    },
    {
      type: 'folder',
      name: 'Loose',
      children: [{ type: 'page', name: 'Loose child', url: '/docs/loose' }],
    },
    {
      type: 'page',
      name: 'External',
      url: 'https://example.com',
      external: true,
    },
  ],
}

function renderLayout(ui: ReactElement) {
  return render(
    <MantineProvider>
      <FrameworkProvider
        usePathname={() => '/docs/guide/setup'}
        useParams={() => ({}) as never}
        useRouter={() => ({}) as never}
      >
        {ui}
      </FrameworkProvider>
    </MantineProvider>
  )
}

function layout(props: Partial<ComponentProps<typeof DocsLayout>> = {}) {
  return renderLayout(
    <SearchProvider>
      <DocsLayout tree={tree} nav={{ title: 'Fumandocs' }} {...props}>
        <p>page content</p>
      </DocsLayout>
    </SearchProvider>
  )
}

describe('DocsLayout', () => {
  it('renders the navigation tree', () => {
    layout()

    expect(screen.getByText('page content')).toBeInTheDocument()
    expect(screen.getAllByText('Fumandocs').length).toBeGreaterThan(0)
    expect(screen.getByText('Guides')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveAttribute(
      'href',
      '/docs/intro'
    )
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute(
      'href',
      '/docs/guide/setup'
    )
    expect(screen.getByRole('link', { name: /External/ })).toHaveAttribute(
      'target',
      '_blank'
    )
  })

  it('only puts menu links in the sidebar', () => {
    layout({
      links: [
        { text: 'Nav only', url: '/nav' },
        { text: 'In menu', url: '/menu', on: 'menu' },
        { text: 'Everywhere', url: '/all', on: 'all' },
      ],
    })

    expect(screen.queryByRole('link', { name: 'Nav only' })).toBeNull()
    expect(screen.getByRole('link', { name: 'In menu' })).toHaveAttribute(
      'href',
      '/menu'
    )
    expect(screen.getByRole('link', { name: 'Everywhere' })).toBeInTheDocument()
  })

  it('marks the current page', () => {
    const { container } = layout()

    const active = container.querySelector('[data-active="true"]')
    expect(active).not.toBeNull()
    expect(active).toHaveTextContent('Setup')
  })

  it('hides the sidebar when disabled', () => {
    const { container } = layout({ sidebar: { enabled: false } })

    expect(container.querySelector('aside')).toBeNull()
    expect(container.querySelector('[data-no-sidebar]')).not.toBeNull()
  })

  it('uses a custom sidebar slot when provided', () => {
    layout({ slots: { sidebar: () => <div>custom sidebar</div> } })

    expect(screen.getByText('custom sidebar')).toBeInTheDocument()
    expect(screen.queryByText('Introduction')).toBeNull()
  })

  it('collapses and expands the sidebar', () => {
    const { container } = layout()
    const aside = container.querySelector('aside')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(aside).toHaveAttribute('data-collapsed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Open sidebar' }))
    expect(aside?.getAttribute('data-collapsed')).toBeNull()
  })

  it('peeks at the sidebar while collapsed', () => {
    const { container } = layout()
    const aside = container.querySelector('aside') as HTMLElement

    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    fireEvent.pointerEnter(aside)
    expect(aside).toHaveAttribute('data-hovered', 'true')

    fireEvent.pointerLeave(aside)
    expect(aside).toBeInTheDocument()
  })

  it('opens the mobile navigation drawer', async () => {
    layout()

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('hides the mobile header when nav is disabled', () => {
    layout({ nav: { enabled: false } })

    expect(screen.queryByRole('button', { name: 'Open navigation' })).toBeNull()
  })

  it('toggles the color scheme', () => {
    layout()

    const button = screen.getByRole('button', { name: 'Toggle Theme' })
    fireEvent.click(button)

    expect(button).toBeInTheDocument()
  })

  it('renders a search button when search is enabled', () => {
    layout()

    expect(
      screen.getAllByRole('button', { name: /Search/ }).length
    ).toBeGreaterThan(0)
  })

  it('hides the search button when the toggle is disabled', () => {
    layout({ searchToggle: { enabled: false } })

    expect(screen.queryByRole('button', { name: /Search/ })).toBeNull()
  })

  it('renders the sidebar footer links', () => {
    layout({ githubUrl: 'https://github.com/example/repo' })

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo'
    )
  })

  it('omits the footer entirely when nothing is configured', () => {
    layout({ themeSwitch: { enabled: false } })

    expect(screen.queryByRole('button', { name: 'Toggle Theme' })).toBeNull()
  })

  it('throws when page components are used outside the layout', () => {
    function Probe() {
      useDocsLayout()
      return null
    }

    expect(() => render(<Probe />)).toThrow(/inside <DocsLayout>/)
  })
})
