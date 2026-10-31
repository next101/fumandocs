import { Badge, Container, Group, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { formatDate, getPosts } from '@/lib/blog'
import classes from './blog-index.module.css'

export function BlogIndex() {
  const posts = getPosts()

  return (
    <Container size={760} py={{ base: 56, md: 88 }}>
      <Stack gap="xs" mb={48}>
        <Title order={1}>Blog</Title>
        <Text c="dimmed" size="lg">
          Notes, essays, and updates.
        </Text>
      </Stack>

      {posts.length === 0 ? (
        <Text c="dimmed">No posts yet.</Text>
      ) : (
        <Stack component="ul" gap="xl" className={classes.list}>
          {posts.map((post) => (
            <li key={post.url}>
              <article>
                <Group gap={8} c="dimmed">
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
                <Title order={2} className={classes.title}>
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
                        radius="sm"
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
      )}
    </Container>
  )
}
