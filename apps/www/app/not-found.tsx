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

import { Container, Stack, Text, Title } from '@mantine/core'
import { ArrowLeftIcon } from '@phosphor-icons/react/ssr'
import { LinkButton } from '@/components/home/shared'
import classes from '@/components/home/shared.module.css'

export default function NotFound() {
  return (
    <Container size={1440} py={120}>
      <Stack align="center" ta="center" gap="md">
        <Title order={1} className={classes.title} data-order="1">
          404
        </Title>
        <Text className={classes.description} mt={0}>
          This page could not be found — it may have been moved, renamed, or
          never existed.
        </Text>
        <LinkButton
          href="/"
          variant="default"
          radius="md"
          size="md"
          mt="lg"
          leftSection={<ArrowLeftIcon size={16} />}
        >
          Back to home
        </LinkButton>
      </Stack>
    </Container>
  )
}
