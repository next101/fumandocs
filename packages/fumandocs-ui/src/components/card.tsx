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
  Card as MantineCard,
  SimpleGrid,
  type SimpleGridProps,
  Text,
  ThemeIcon,
} from '@mantine/core'
import Link from 'fumadocs-core/link'
import type { HTMLAttributes, ReactNode } from 'react'
import classes from './card.module.css'

export function Cards(props: SimpleGridProps) {
  return <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={16} {...props} />
}

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  href?: string
  external?: boolean
}

export function Card({
  title,
  description,
  icon,
  href,
  external,
  children,
  ...props
}: CardProps) {
  const content = (
    <>
      {icon && (
        <ThemeIcon
          variant="default"
          radius="md"
          mb="sm"
          className={classes.icon}
        >
          {icon}
        </ThemeIcon>
      )}
      <Text fw={500} size="sm">
        {title}
      </Text>
      {description && (
        <Text size="sm" mt={4}>
          {description}
        </Text>
      )}
      {children && <div className={classes.content}>{children}</div>}
    </>
  )

  if (href) {
    return (
      <MantineCard
        component={Link}
        href={href}
        external={external}
        withBorder
        padding="md"
        radius="xs"
        className={classes.root}
        {...props}
      >
        {content}
      </MantineCard>
    )
  }

  return (
    <MantineCard
      withBorder
      padding="md"
      radius="xs"
      className={classes.root}
      {...props}
    >
      {content}
    </MantineCard>
  )
}
