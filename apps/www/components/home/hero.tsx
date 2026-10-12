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

import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import {
  ArrowClockwiseIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
  LockIcon,
} from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import classes from './hero.module.css'
import { LinkButton } from './shared'
import sharedClasses from './shared.module.css'
import { Terminal } from './terminal'

async function DocsPreview() {
  return (
    <Paper
      withBorder
      radius="md"
      shadow="md"
      w="100%"
      style={{ overflow: 'hidden' }}
    >
      <Group
        gap={6}
        px="md"
        py={10}
        wrap="nowrap"
        className={classes.windowChrome}
      >
        <span className={`${classes.dot} ${classes.dotClose}`} />
        <span className={`${classes.dot} ${classes.dotMinimize}`} />
        <span className={`${classes.dot} ${classes.dotMaximize}`} />
        <Link
          href="/docs/getting-started"
          className={classes.windowUrl}
          title="Open the getting started guide"
        >
          <LockIcon size={11} weight="fill" />
          <Text size="xs" c="dimmed" truncate lh={1}>
            localhost:3000/docs/getting-started
          </Text>
        </Link>
        <ArrowClockwiseIcon size={14} className={classes.windowAction} />
        <span className={classes.loadBar} aria-hidden />
      </Group>
      <Divider />
      <Stack p={{ base: 'md', sm: 'xl' }} gap="md">
        <Title order={2} size="h3">
          Getting started
        </Title>
        <Text c="dimmed" size="sm">
          Scaffold a complete documentation site with one command, then write
          your content in MDX — Fumandocs handles the page tree, search, and
          layout.
        </Text>
        <Terminal />
      </Stack>
    </Paper>
  )
}

export function HeroSection() {
  return (
    <section className={classes.jumbotron}>
      <Container size={1440}>
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={50}>
          <div>
            <Title order={1} className={sharedClasses.title}>
              Fumadocs site, powered by Mantine
            </Title>

            <Text className={sharedClasses.description}>
              Fumandocs pairs the{' '}
              <a
                href="https://fumadocs.dev"
                target="_blank"
                rel="noreferrer"
                className={classes.descriptionLink}
              >
                Fumadocs
              </a>{' '}
              content engine with the full{' '}
              <a
                href="https://mantine.dev"
                target="_blank"
                rel="noreferrer"
                className={classes.descriptionLink}
              >
                Mantine
              </a>{' '}
              component library — build beautiful, interactive documentation
              with the React components you already know, without a single line
              of Tailwind.
            </Text>

            <p className={classes.equation}>
              <a
                href="https://fumadocs.dev"
                target="_blank"
                rel="noreferrer"
                className={`${classes.eqTerm} ${classes.eqFuBg}`}
                title="Fumadocs — the content engine"
              >
                <span className={classes.eqFu}>fu</span>
                <span className={classes.eqRest}>madocs</span>
              </a>
              <span className={classes.eqOp}>+</span>
              <a
                href="https://mantine.dev"
                target="_blank"
                rel="noreferrer"
                className={`${classes.eqTerm} ${classes.eqManBg}`}
                title="Mantine — the UI library"
              >
                <span className={classes.eqMan}>man</span>
                <span className={classes.eqRest}>tine</span>
              </a>
              <span className={classes.eqOp}>+</span>
              <span className={`${classes.eqTerm} ${classes.eqDocsBg}`}>
                <span className={classes.eqDocs}>docs</span>
              </span>
              <span className={classes.eqOp}>=</span>
              <span className={classes.eqResult}>
                <span className={classes.eqFu}>fu</span>
                <span className={classes.eqMan}>man</span>
                <span className={classes.eqDocs}>docs</span>
              </span>
            </p>

            <div className={classes.actions}>
              <LinkButton
                href="/docs/getting-started"
                className={classes.action}
                data-get-started
                justify="space-between"
                rightSection={<ArrowUpRightIcon size={26} />}
              >
                Get Started
              </LinkButton>
              <Button
                component="a"
                href="https://github.com/next101/fumandocs"
                target="_blank"
                rel="noreferrer"
                className={classes.action}
                data-github
                justify="space-between"
                rightSection={<GithubLogoIcon size={26} />}
              >
                GitHub
              </Button>
            </div>
          </div>

          <DocsPreview />
        </SimpleGrid>
      </Container>
    </section>
  )
}
