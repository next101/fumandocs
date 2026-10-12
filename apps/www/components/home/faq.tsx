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
  Accordion,
  Anchor,
  Container,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './shared.module.css'

interface FaqItem {
  value: string
  question: string
  answer: ReactNode
}

const items: FaqItem[] = [
  {
    value: 'what-is-fumandocs',
    question: 'What is Fumandocs?',
    answer: (
      <>
        Fumandocs is three things working together:{' '}
        <strong>fumadocs-core</strong> and <strong>fumadocs-mdx</strong> for the
        content engine (page tree, search, MDX pipeline),{' '}
        <strong>fumandocs-ui</strong> as the Mantine-styled UI layer, and{' '}
        <strong>create-fumandocs</strong>, a CLI that scaffolds a ready-to-run
        Next.js docs site.
      </>
    ),
  },
  {
    value: 'why-mantine',
    question: 'Why Mantine instead of Tailwind?',
    answer: (
      <>
        Tailwind is a utility-first CSS library, not a component framework,
        while Mantine is a full-fledged UI framework. fumadocs-ui styles
        everything with Tailwind. Fumandocs swaps that UI layer for Mantine, so
        every primitive — callouts, code blocks, cards, tabs — is a themed
        Mantine component with dark mode, radius, and color scheme support built
        in.
      </>
    ),
  },
  {
    value: 'fumadocs-compat',
    question: 'Is it compatible with fumadocs-ui?',
    answer: (
      <>
        Partially. <code>fumandocs-ui</code> mirrors the fumadocs-ui export
        paths and component APIs, so existing MDX content and layouts port over
        with minimal changes. However, some fumadocs-ui components already have
        Mantine equivalents, so we don't replicate them. See the{' '}
        <Anchor href="/docs/export-compatibility">export compatibility</Anchor>{' '}
        page for the full mapping.
      </>
    ),
  },
  {
    value: 'getting-started',
    question: 'How do I create a project?',
    answer: (
      <>
        Run <code>npx create-fumandocs my-docs</code>, confirm the install
        prompt, and you get a Next.js app with MDX content, search, and the docs
        layout pre-wired. The{' '}
        <Anchor href="/docs/getting-started">getting started guide</Anchor>{' '}
        walks through it.
      </>
    ),
  },
  {
    value: 'license',
    question: 'Is Fumandocs free?',
    answer: (
      <>
        Yes — Fumandocs is open source under the MIT license and developed on{' '}
        <Anchor
          href="https://github.com/next101/fumandocs"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Anchor>
        .
      </>
    ),
  },
]

export function FaqSection() {
  const midpoint = Math.ceil(items.length / 2)
  const firstHalf = items.slice(0, midpoint)
  const secondHalf = items.slice(midpoint)

  return (
    <section className={classes.sectionAlt}>
      <Container size={1440}>
        <Title order={2} className={classes.title} ta="center">
          Frequently asked questions
        </Title>

        <Text className={classes.description} ta="center" mx="auto" mb={50}>
          Everything you need to know about Fumandocs, Fumadocs, and Mantine.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Accordion variant="separated" radius="md">
            {firstHalf.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>
                  <Text fw={500} size="sm">
                    {item.question}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{item.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>

          <Accordion variant="separated" radius="md">
            {secondHalf.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>
                  <Text fw={500} size="sm">
                    {item.question}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm">{item.answer}</Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </SimpleGrid>
      </Container>
    </section>
  )
}
