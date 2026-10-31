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

'use client'

import {
  Box,
  Kbd,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { createMarkdownRenderer } from 'fumadocs-core/content/md'
import Link from 'fumadocs-core/link'
import { useDocsSearch } from 'fumadocs-core/search/client'
import { fetchClient } from 'fumadocs-core/search/client/fetch'
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import rehypeRaw from 'rehype-raw'
import classes from './search.module.css'

// Renders search result snippets (markdown with <mark> highlights) the same
// way upstream fumadocs-ui's search dialog does.
const mdRenderer = createMarkdownRenderer({
  remarkRehypeOptions: { allowDangerousHtml: true },
  rehypePlugins: [rehypeRaw, rehypeCustomElements],
})

interface HastNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

// MDX snippets may contain unknown (JSX) tags; render them inertly instead of
// letting React treat them as host components.
function rehypeCustomElements() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (
        node.type === 'element' &&
        node.tagName &&
        typeof document !== 'undefined' &&
        document.createElement(node.tagName) instanceof HTMLUnknownElement
      ) {
        node.properties = { ...node.properties, _tagName: node.tagName }
        node.tagName = 'custom'
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

const mdComponents = {
  mark: (props: HTMLAttributes<HTMLElement>) => (
    <span {...props} className={classes.highlight} />
  ),
  a: 'span',
  // unknown JSX tags from MDX snippets are renamed to <custom> upstream
  custom: (props: { children?: ReactNode }) => <span>{props.children}</span>,
} as const

export interface SearchOptions {
  enabled?: boolean
  api?: string
  links?: { title: string; url: string }[]
}

interface SearchContextValue {
  enabled: boolean
  open: () => void
}

const SearchContext = createContext<SearchContextValue>({
  enabled: false,
  open: () => undefined,
})

export function useSearch() {
  return use(SearchContext)
}

export function SearchProvider({
  children,
  enabled = true,
  api = '/api/search',
  links = [],
}: SearchOptions & { children?: ReactNode }) {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if (
        !isEditable &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        setOpened((value) => !value)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  const value = useMemo(
    () => ({ enabled, open: () => setOpened(true) }),
    [enabled]
  )

  return (
    <SearchContext value={value}>
      {children}
      {enabled && (
        <SearchDialog
          opened={opened}
          onClose={() => setOpened(false)}
          api={api}
          links={links}
        />
      )}
    </SearchContext>
  )
}

function SearchDialog({
  opened,
  onClose,
  api,
  links,
}: {
  opened: boolean
  onClose: () => void
  api: string
  links: { title: string; url: string }[]
}) {
  const { search, setSearch, query } = useDocsSearch({
    client: fetchClient({ api }),
  })
  const results = query.data === 'empty' || !query.data ? [] : query.data
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Search documentation"
      centered
      size="lg"
      transitionProps={{
        onEntered: () => inputRef.current?.focus(),
      }}
    >
      <TextInput
        ref={inputRef}
        autoFocus
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        placeholder="Search documentation…"
        rightSection={query.isLoading ? <Loader size="xs" /> : <Kbd>Esc</Kbd>}
        size="md"
      />
      <ScrollArea.Autosize mah="60vh" mt="md">
        <Stack gap={4}>
          {search.length === 0 &&
            links.map((item) => (
              <SearchResult
                key={item.url}
                href={item.url}
                onClick={onClose}
                title={item.title}
              />
            ))}
          {results.map((item) => (
            <SearchResult
              key={item.id}
              href={item.url}
              onClick={onClose}
              title={
                typeof item.content === 'string' ? (
                  <mdRenderer.Markdown components={mdComponents}>
                    {item.content}
                  </mdRenderer.Markdown>
                ) : (
                  item.content
                )
              }
              description={item.breadcrumbs?.join(' / ')}
            />
          ))}
          {search.length > 0 && !query.isLoading && results.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No results found.
            </Text>
          )}
          {query.error && (
            <Text c="red">Search failed: {query.error.message}</Text>
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Modal>
  )
}

function SearchResult({
  href,
  title,
  description,
  onClick,
}: {
  href: string
  title: ReactNode
  description?: ReactNode
  onClick: () => void
}) {
  return (
    <UnstyledButton
      component={Link}
      href={href}
      onClick={onClick}
      className={classes.result}
    >
      <Box>
        <Text component="div" fw={500} size="sm" lineClamp={1}>
          {title}
        </Text>
        {description && (
          <Text component="div" c="dimmed" size="xs" lineClamp={1}>
            {description}
          </Text>
        )}
      </Box>
    </UnstyledButton>
  )
}
