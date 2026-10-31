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
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchProvider, useSearch } from './search'

function SearchProbe() {
  const search = useSearch()
  return (
    <button type="button" onClick={search.open}>
      {String(search.enabled)}
    </button>
  )
}

const searchState = vi.hoisted(() => ({
  search: '',
  setSearch: vi.fn(),
  query: {
    data: undefined as unknown,
    isLoading: false,
    error: null as Error | null,
  },
}))

vi.mock('fumadocs-core/search/client', () => ({
  useDocsSearch: () => searchState,
}))

vi.mock('fumadocs-core/search/client/fetch', () => ({
  fetchClient: () => ({}),
}))

function renderSearch(ui: ReactNode) {
  return render(<MantineProvider>{ui}</MantineProvider>)
}

async function openDialog() {
  fireEvent.keyDown(window, { key: 'k', metaKey: true })
  return screen.findByText('Search documentation')
}

beforeEach(() => {
  searchState.search = ''
  searchState.query.data = undefined
  searchState.query.isLoading = false
  searchState.query.error = null
  searchState.setSearch.mockClear()
})

describe('SearchProvider', () => {
  it('renders its children', () => {
    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('opens the dialog on meta+k', async () => {
    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    expect(await openDialog()).toBeInTheDocument()
  })

  it('opens the dialog on ctrl+k', async () => {
    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(await screen.findByText('Search documentation')).toBeInTheDocument()
  })

  it('ignores the shortcut while typing in an input', () => {
    renderSearch(
      <SearchProvider>
        <input aria-label="field" />
      </SearchProvider>
    )

    fireEvent.keyDown(screen.getByLabelText('field'), {
      key: 'k',
      metaKey: true,
    })

    expect(screen.queryByText('Search documentation')).toBeNull()
  })

  it('does not render the dialog when disabled', async () => {
    renderSearch(
      <SearchProvider enabled={false}>
        <span>content</span>
      </SearchProvider>
    )

    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    expect(screen.queryByText('Search documentation')).toBeNull()
  })

  it('lists configured links while the query is empty', async () => {
    renderSearch(
      <SearchProvider links={[{ title: 'Introduction', url: '/docs' }]}>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('Introduction')).toBeInTheDocument()
  })

  it('renders string results through the markdown renderer', async () => {
    searchState.search = 'hello'
    searchState.query.data = [
      {
        id: '1',
        url: '/docs/a',
        content: 'Hello <mark>world</mark>',
        breadcrumbs: ['Docs', 'A'],
      },
    ]

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('Docs / A')).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
  })

  it('renders node results directly', async () => {
    searchState.search = 'hello'
    searchState.query.data = [
      { id: '1', url: '/docs/a', content: <b>Node result</b> },
    ]

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('Node result')).toBeInTheDocument()
  })

  it('renders inert custom elements instead of host components', async () => {
    searchState.search = 'hello'
    searchState.query.data = [
      { id: '1', url: '/docs/a', content: '<MyWidget>inside</MyWidget>' },
    ]

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('inside')).toBeInTheDocument()
  })

  it('reports an empty result set', async () => {
    searchState.search = 'nothing'
    searchState.query.data = []

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('reports query errors', async () => {
    searchState.query.error = new Error('boom')

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.getByText('Search failed: boom')).toBeInTheDocument()
  })

  it('shows a loader while the query is loading', async () => {
    searchState.query.isLoading = true

    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()

    expect(screen.queryByText('Esc')).toBeNull()
  })

  it('forwards input changes to the search state', async () => {
    renderSearch(
      <SearchProvider>
        <span>content</span>
      </SearchProvider>
    )

    await openDialog()
    fireEvent.change(screen.getByPlaceholderText('Search documentation…'), {
      target: { value: 'query' },
    })

    expect(searchState.setSearch).toHaveBeenCalledWith('query')
  })
})

describe('useSearch', () => {
  it('is disabled and inert without a provider', () => {
    render(<SearchProbe />)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('false')
    fireEvent.click(button)
  })
})
