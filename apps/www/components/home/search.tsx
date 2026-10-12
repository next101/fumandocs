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
  Container,
  Group,
  Kbd,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { FileTextIcon, MagnifyingGlassIcon } from '@phosphor-icons/react/ssr'
import { useSearch } from 'fumandocs-ui/search'
import searchClasses from './search.module.css'
import { LearnMore } from './shared'
import classes from './shared.module.css'

const mockResults = [
  {
    id: 'theming',
    title: 'Theming',
    excerpt: (
      <>
        Customize the look and feel with Mantine{`'`}s{' '}
        <mark className={searchClasses.highlight}>theme</mark> object.
      </>
    ),
    breadcrumbs: 'Docs / Guides',
  },
  {
    id: 'components',
    title: 'Callouts',
    excerpt: (
      <>
        Use <mark className={searchClasses.highlight}>Callout</mark> to
        highlight tips, warnings, and important notes in your MDX pages.
      </>
    ),
    breadcrumbs: 'Docs / Components',
  },
  {
    id: 'search',
    title: 'Search',
    excerpt: (
      <>
        Full-text <mark className={searchClasses.highlight}>search</mark> is
        generated from your content at build time.
      </>
    ),
    breadcrumbs: 'Docs / Guides',
  },
]

function SearchMockup() {
  return (
    <Paper
      withBorder
      radius="md"
      shadow="sm"
      className={searchClasses.searchMockup}
    >
      <TextInput
        readOnly
        placeholder="Search documentation…"
        leftSection={<MagnifyingGlassIcon size={18} />}
        rightSection={
          <Group gap={4} wrap="nowrap">
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
          </Group>
        }
        classNames={{ input: searchClasses.searchInput }}
      />

      <Stack gap={4} mt="md">
        {mockResults.map((item) => (
          <UnstyledButton key={item.id} className={searchClasses.searchResult}>
            <Group gap="sm" wrap="nowrap" align="flex-start">
              <Box className={searchClasses.resultIcon}>
                <FileTextIcon size={18} />
              </Box>
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {item.title}
                </Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {item.excerpt}
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  {item.breadcrumbs}
                </Text>
              </Box>
            </Group>
          </UnstyledButton>
        ))}
      </Stack>
    </Paper>
  )
}

export function SearchSection() {
  const { open, enabled } = useSearch()

  return (
    <section className={classes.section}>
      <Container size={1440}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          <div>
            <Title order={2} className={classes.title}>
              Full-text search, built in
            </Title>

            <Text className={classes.description} component="div">
              Fumadocs-core generates a search index from your MDX content at
              build time. Hit{' '}
              <span className={searchClasses.kbdInline}>
                <Kbd size="sm">⌘</Kbd>
                <Kbd size="sm">K</Kbd>
              </span>{' '}
              anywhere on the site, or open the real dialog below.
            </Text>

            <UnstyledButton
              className={searchClasses.openSearchButton}
              onClick={open}
              disabled={!enabled}
            >
              <MagnifyingGlassIcon size={20} />
              Open search dialog
              <span className={searchClasses.openSearchHint}>
                {enabled ? 'Uses live /api/search' : 'Search disabled'}
              </span>
            </UnstyledButton>

            <LearnMore
              href="https://fumadocs.dev/docs/headless/search"
              external
            >
              Learn about Fumadocs search
            </LearnMore>
          </div>

          <div>
            <SearchMockup />
          </div>
        </SimpleGrid>
      </Container>
    </section>
  )
}
