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

import { Container, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core'
import {
  CaretRightIcon,
  FileCodeIcon,
  FilesIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  TreeStructureIcon,
} from '@phosphor-icons/react/ssr'
import editorClasses from './engine.module.css'
import { type HomeFeatureData, HomeFeatures, LearnMore } from './shared'
import classes from './shared.module.css'
import { ShikiCodeBlockServer } from './shiki-code-block.server'

const features: HomeFeatureData[] = [
  {
    icon: <FilesIcon size={30} />,
    title: 'Content collections in MDX',
    description:
      'fumadocs-mdx turns your content folder into a typed collection with frontmatter validation and hot reload',
  },
  {
    icon: <TreeStructureIcon size={30} />,
    title: 'Page tree & navigation',
    description:
      'Sidebar, breadcrumbs, and table of contents are generated from your file structure automatically',
  },
  {
    icon: <MagnifyingGlassIcon size={30} />,
    title: 'Full-text search',
    description:
      'Built-in search powered by fumadocs-core — works on static exports, no external service required',
  },
  {
    icon: <LightningIcon size={30} />,
    title: 'Next.js native',
    description:
      'App Router layouts, static export or dynamic rendering, and first-class MDX support out of the box',
  },
]

const mdxSample = `---
title: Getting started
description: Scaffold your docs site
---

import { Callout } from 'fumandocs-ui/components/callout'
import { Cards, Card } from 'fumandocs-ui/components/card'

# Getting started

Welcome to **Fumandocs** — write content in MDX,
and fumadocs-mdx builds the page tree for you.

<Callout type="idea">
  Every primitive is a Mantine component.
</Callout>

## What's next

<Cards>
  <Card title="Theming" href="/docs/guides/theming" />
  <Card title="Components" href="/docs/components/callouts" />
</Cards>`

export function EngineSection() {
  return (
    <section className={classes.sectionAlt}>
      <Container size={1440}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          <div>
            <Title order={2} className={classes.title}>
              Built on the Fumadocs engine
            </Title>

            <Text className={classes.description}>
              Fumandocs keeps everything you love about Fumadocs — the MDX
              pipeline, page tree, and search — and swaps the Tailwind UI layer
              for Mantine components.
            </Text>

            <LearnMore href="/docs">
              How Fumandocs relates to Fumadocs
            </LearnMore>

            <HomeFeatures data={features} />
          </div>

          <div>
            <Paper
              withBorder
              radius="md"
              shadow="sm"
              className={editorClasses.editor}
            >
              <div className={editorClasses.tabBar}>
                <Group gap={6} pl="md" pr="lg" wrap="nowrap">
                  <span
                    className={`${editorClasses.dot} ${editorClasses.dotClose}`}
                  />
                  <span
                    className={`${editorClasses.dot} ${editorClasses.dotMinimize}`}
                  />
                  <span
                    className={`${editorClasses.dot} ${editorClasses.dotMaximize}`}
                  />
                </Group>
                <div
                  className={`${editorClasses.tab} ${editorClasses.tabActive}`}
                >
                  <FileCodeIcon size={14} />
                  index.mdx
                </div>
                <div className={editorClasses.tab}>meta.json</div>
              </div>
              <div className={editorClasses.breadcrumb}>
                content
                <CaretRightIcon
                  size={10}
                  className={editorClasses.breadcrumbSeparator}
                />
                docs
                <CaretRightIcon
                  size={10}
                  className={editorClasses.breadcrumbSeparator}
                />
                index.mdx
              </div>
              <ShikiCodeBlockServer lang="mdx" code={mdxSample} />
              <div className={editorClasses.statusBar}>
                <span>main*</span>
                <span className={editorClasses.statusBarItems}>
                  <span>MDX</span>
                  <span>UTF-8</span>
                  <span>Prettier</span>
                </span>
              </div>
            </Paper>
          </div>
        </SimpleGrid>
      </Container>
    </section>
  )
}
