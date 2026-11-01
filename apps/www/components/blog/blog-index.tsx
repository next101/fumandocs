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
  Anchor,
  Badge,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { RssSimpleIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { formatDate, getPosts } from '@/lib/blog'
import classes from './blog-index.module.css'

export function BlogIndex() {
  const posts = getPosts()
  const years = [...new Set(posts.map((post) => post.data.date.getFullYear()))]

  return (
    <Container size="xl" py={{ base: 48, md: 72 }}>
      <div className={classes.index}>
        <div className={classes.main}>
          <Stack gap="xs" mb={40}>
            <Group justify="space-between" align="flex-end" gap="md">
              <Title order={1} className={classes.title}>
                Blog
              </Title>
              <Anchor
                href="/blog/rss.xml"
                c="dimmed"
                size="sm"
                className={classes.rss}
              >
                <RssSimpleIcon size={16} />
                RSS
              </Anchor>
            </Group>
            <Text c="dimmed" size="lg">
              Notes, essays, and updates.
            </Text>
          </Stack>

          {posts.length === 0 ? (
            <Text c="dimmed">No posts yet.</Text>
          ) : (
            years.map((year) => (
              <section key={year} className={classes.year}>
                <Text className={classes.yearLabel}>{year}</Text>
                <Stack component="ul" gap={0} className={classes.list}>
                  {posts
                    .filter((post) => post.data.date.getFullYear() === year)
                    .map((post) => (
                      <li key={post.url} className={classes.item}>
                        <article>
                          <Group gap={8} c="dimmed" fz="sm" mb={6}>
                            <Text
                              component="time"
                              dateTime={post.data.date.toISOString()}
                              size="sm"
                            >
                              {formatDate(post.data.date)}
                            </Text>
                            {post.data.draft && (
                              <Badge size="xs" variant="light" color="yellow">
                                Draft
                              </Badge>
                            )}
                          </Group>
                          <Title order={2} className={classes.postTitle}>
                            <Link href={post.url} className={classes.link}>
                              {post.data.title}
                            </Link>
                          </Title>
                          <Text c="dimmed" className={classes.description}>
                            {post.data.description}
                          </Text>
                          {post.data.tags.length > 0 && (
                            <Group gap={6} mt="sm">
                              {post.data.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="default"
                                  size="sm"
                                  tt="none"
                                  fw={500}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </Group>
                          )}
                        </article>
                      </li>
                    ))}
                </Stack>
              </section>
            ))
          )}
        </div>

        <aside className={classes.rail}>
          <div className={classes.railCard}>
            <Text className={classes.railTitle}>Subscribe</Text>
            <Text size="sm" c="dimmed" className={classes.railText}>
              Get new posts in your favorite reader.
            </Text>
            <Button
              component="a"
              href="/blog/rss.xml"
              variant="default"
              size="compact-sm"
              leftSection={<RssSimpleIcon size={16} />}
              fullWidth
              mt="sm"
            >
              RSS feed
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  )
}
