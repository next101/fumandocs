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
  Avatar,
  Badge,
  Button,
  ColorSwatch,
  Container,
  Group,
  Paper,
  Rating,
  SegmentedControl,
  SimpleGrid,
  Switch,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { MoonIcon, SunIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import classes from './shared.module.css'
import { ShikiCodeBlock } from './shiki-code-block'

const code = `import { MantineProvider } from '@mantine/core'

function Demo() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  )
}`

function DemoCard() {
  const [notifications, setNotifications] = useState('All')

  return (
    <Paper withBorder radius="md" shadow="md" p="xl">
      <Group justify="space-between" wrap="nowrap">
        <Group wrap="nowrap">
          <Avatar color="blue" radius="xl" size="lg">
            FD
          </Avatar>
          <div>
            <Text fw={600} lh={1.2}>
              Fumandocs
            </Text>
            <Text size="sm" c="dimmed" lh={1.4}>
              Docs, the Mantine way
            </Text>
          </div>
        </Group>
        <Badge variant="light" color="teal">
          stable
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mt="md">
        Every component on this page — including the docs UI itself — follows
        the active color scheme automatically.
      </Text>

      <Group mt="lg" grow>
        <Button
          radius="md"
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan' }}
        >
          Follow
        </Button>
        <Button radius="md" variant="default">
          Message
        </Button>
      </Group>

      <Group justify="space-between" mt="lg">
        <Switch defaultChecked label="Release notes" />
        <SegmentedControl
          size="xs"
          value={notifications}
          onChange={setNotifications}
          data={['All', 'Mentions', 'None']}
        />
      </Group>

      <Group justify="space-between" mt="xl">
        <div>
          <Text size="sm" fw={500}>
            Reader rating
          </Text>
          <Text size="xs" c="dimmed">
            What doc authors think of the dark theme
          </Text>
        </div>
        <Rating defaultValue={4.5} fractions={2} readOnly />
      </Group>

      <div>
        <Text size="sm" fw={500} mt="md">
          Theme palette
        </Text>
        <Group gap="xs" mt={6}>
          {['blue', 'teal', 'grape', 'yellow', 'gray', 'dark', 'red'].map(
            (color) => (
              <ColorSwatch
                key={color}
                color={`var(--mantine-color-${color}-6)`}
                size={22}
              />
            )
          )}
        </Group>
      </div>

      <div>
        <Text size="sm" fw={500} mt="lg">
          Text hierarchy
        </Text>
        <Text size="sm" c="bright" mt={6}>
          Bright text for headings and key content
        </Text>
        <Text size="sm" mt={2}>
          Default text for body copy
        </Text>
        <Text size="sm" c="dimmed" mt={2}>
          Dimmed text for captions and metadata
        </Text>
      </div>
    </Paper>
  )
}

export function DarkSchemeSection() {
  const { toggleColorScheme } = useMantineColorScheme()
  const colorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })

  return (
    <section className={classes.sectionAlt}>
      <Container size={1440}>
        <Title order={2} className={classes.title}>
          Dark color scheme
        </Title>

        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing={50}
          verticalSpacing="xl"
          mt="xl"
        >
          <div>
            <Text className={classes.description} mt={0}>
              Add dark theme to your docs with a few lines of code — Mantine
              exports global styles for both light and dark themes, and every
              component supports dark theme out of the box.
            </Text>

            <ShikiCodeBlock title="app.tsx" lang="tsx" code={code} />

            <Group mt="xl">
              <Button
                variant="default"
                radius="md"
                size="md"
                onClick={() => toggleColorScheme()}
                leftSection={
                  colorScheme === 'dark' ? (
                    <SunIcon size={18} />
                  ) : (
                    <MoonIcon size={18} />
                  )
                }
              >
                Toggle color scheme
              </Button>
            </Group>
          </div>

          <DemoCard />
        </SimpleGrid>
      </Container>
    </section>
  )
}
