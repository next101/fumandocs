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
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FrameworkProvider } from 'fumadocs-core/framework'
import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  PageActions,
  PageBreadcrumb,
  PageLastUpdate,
  ViewOptionsPopover,
  withArticle,
} from './page'

const layout = vi.hoisted(() => ({
  pages: [] as { type: 'page'; name: string; url: string }[],
  pathname: '/docs/b',
}))

vi.mock('./index', () => ({
  useDocsLayout: () => layout,
}))

function renderPage(ui: ReactElement) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

const pages = [
  { type: 'page' as const, name: 'Page A', url: '/docs/a' },
  { type: 'page' as const, name: 'Page B', url: '/docs/b' },
  { type: 'page' as const, name: 'Page C', url: '/docs/c' },
]

describe('DocsPage pagination', () => {
  beforeEach(() => {
    layout.pages = pages
    layout.pathname = '/docs/b'
  })

  it('links to the previous and next pages', () => {
    renderPage(<DocsPage />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/docs/a')
    expect(links[0]).toHaveTextContent('Page A')
    expect(links[1]).toHaveAttribute('href', '/docs/c')
    expect(links[1]).toHaveTextContent('Page C')
  })

  it('only links forward on the first page', () => {
    layout.pathname = '/docs/a'
    renderPage(<DocsPage />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/docs/b')
  })

  it('only links backward on the last page', () => {
    layout.pathname = '/docs/c'
    renderPage(<DocsPage />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/docs/b')
  })

  it('renders no pagination when the pathname is not in the tree', () => {
    layout.pathname = '/docs/missing'
    renderPage(<DocsPage />)

    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('renders no pagination when the footer is disabled', () => {
    renderPage(<DocsPage footer={{ enabled: false }} />)

    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})

describe('DocsDescription', () => {
  it('renders nothing when children are undefined', () => {
    const { container } = renderPage(<DocsDescription />)

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders a paragraph when children are supplied', () => {
    renderPage(<DocsDescription>A description</DocsDescription>)

    expect(screen.getByText('A description').tagName).toBe('P')
  })
})

describe('DocsTitle', () => {
  it('keeps a caller supplied className alongside its own', () => {
    renderPage(<DocsTitle className="custom">Title</DocsTitle>)

    expect(screen.getByRole('heading', { level: 1 }).className).toContain(
      'custom'
    )
  })
})

describe('DocsBody', () => {
  it('marks its content as prose', () => {
    const { container } = renderPage(<DocsBody>text</DocsBody>)

    expect(container.querySelector('[data-prose]')).toHaveTextContent('text')
  })
})

describe('DocsPage table of contents', () => {
  const toc = [{ url: '#intro', title: 'Intro', depth: 2 }]

  it('renders the rail and mobile table of contents', () => {
    const { container } = renderPage(<DocsPage toc={toc} />)

    expect(container.querySelector('details')).not.toBeNull()
    expect(container.querySelector('aside')).not.toBeNull()
    expect(screen.getAllByText('Intro').length).toBe(2)
  })

  it('drops the rail when the page is full', () => {
    const { container } = renderPage(<DocsPage toc={toc} full />)

    expect(container.querySelector('aside')).toBeNull()
    expect(container.querySelector('[data-no-toc]')).not.toBeNull()
    expect(container.querySelector('details')).not.toBeNull()
  })

  it('drops the rail when the table of contents is disabled', () => {
    const { container } = renderPage(
      <DocsPage toc={toc} tableOfContent={{ enabled: false }} />
    )

    expect(container.querySelector('aside')).toBeNull()
  })

  it('drops the mobile table of contents when disabled', () => {
    const { container } = renderPage(
      <DocsPage toc={toc} tableOfContentPopover={{ enabled: false }} />
    )

    expect(container.querySelector('details')).toBeNull()
  })

  it('renders no toc at all for an empty list', () => {
    const { container } = renderPage(<DocsPage />)

    expect(container.querySelector('details')).toBeNull()
    expect(container.querySelector('aside')).toBeNull()
  })
})

describe('MarkdownCopyButton', () => {
  it('copies markdown and flips its label', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ text: async () => '# doc' })
    )

    renderPage(<MarkdownCopyButton markdownUrl="/docs.md" />)
    const button = screen.getByText('Copy Markdown').closest('button')
    expect(button).not.toBeNull()
    fireEvent.click(button as HTMLButtonElement)

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('# doc'))
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('accepts custom children', () => {
    renderPage(
      <MarkdownCopyButton markdownUrl="/docs.md">Copy page</MarkdownCopyButton>
    )

    expect(screen.getByText('Copy page')).toBeInTheDocument()
  })
})

describe('PageLastUpdate', () => {
  it('renders the formatted date', async () => {
    renderPage(<PageLastUpdate date={new Date('2026-01-02')} />)

    expect(await screen.findByText(/Last updated on/)).toBeInTheDocument()
  })
})

describe('PageActions', () => {
  it('renders nothing without children', () => {
    const { container } = render(<PageActions />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders its children', () => {
    renderPage(
      <PageActions>
        <span>action</span>
      </PageActions>
    )

    expect(screen.getByText('action')).toBeInTheDocument()
  })
})

describe('PageBreadcrumb', () => {
  it('renders nothing without children', () => {
    const { container } = render(<PageBreadcrumb />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders its children', () => {
    renderPage(
      <PageBreadcrumb>
        <span>crumb</span>
      </PageBreadcrumb>
    )

    expect(screen.getByText('crumb')).toBeInTheDocument()
  })
})

describe('EditOnGitHub', () => {
  it('renders a default label', () => {
    renderPage(<EditOnGitHub href="/edit" />)

    expect(
      screen.getByRole('link', { name: 'Edit on GitHub' })
    ).toHaveAttribute('href', '/edit')
  })

  it('accepts custom children', () => {
    renderPage(<EditOnGitHub href="/edit">Edit</EditOnGitHub>)

    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument()
  })
})

describe('withArticle', () => {
  it('wraps content in a main landmark', () => {
    render(
      <MantineProvider>
        {withArticle({ children: <p>body</p> })}
      </MantineProvider>
    )

    const main = screen.getByRole('main')
    expect(main).toHaveTextContent('body')
    expect(main.querySelector('[data-prose]')).not.toBeNull()
  })
})

describe('ViewOptionsPopover', () => {
  function renderPopover(githubUrl?: string, markdownUrl?: string) {
    return render(
      <MantineProvider>
        <FrameworkProvider
          usePathname={() => '/docs/a'}
          useParams={() => ({}) as never}
          useRouter={() => ({}) as never}
        >
          <ViewOptionsPopover githubUrl={githubUrl} markdownUrl={markdownUrl} />
        </FrameworkProvider>
      </MantineProvider>
    )
  }

  it('lists all external viewers when urls are supplied', async () => {
    renderPopover('https://github.com/x/y', '/docs/a.md')

    fireEvent.click(screen.getByRole('button', { name: /Open/ }))

    expect(await screen.findByText('Open in GitHub')).toBeInTheDocument()
    expect(screen.getByText('View as Markdown')).toBeInTheDocument()
    expect(screen.getByText('Open in ChatGPT')).toBeInTheDocument()
    expect(screen.getByText('Open in Claude')).toBeInTheDocument()
    expect(screen.getByText('Open in Cursor')).toBeInTheDocument()
  })

  it('still lists the ai viewers without optional urls', async () => {
    renderPopover()

    fireEvent.click(screen.getByRole('button', { name: /Open/ }))

    expect(await screen.findByText('Open in ChatGPT')).toBeInTheDocument()
    expect(screen.queryByText('Open in GitHub')).toBeNull()
    expect(screen.queryByText('View as Markdown')).toBeNull()
  })
})
