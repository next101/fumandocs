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

import { ActionIcon } from '@mantine/core'
import type { ComponentPropsWithoutRef } from 'react'
import classes from './heading.module.css'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type HeadingProps<T extends HeadingTag = 'h2'> = Omit<
  ComponentPropsWithoutRef<T>,
  'as'
> & {
  as?: T
}

export function Heading<T extends HeadingTag = 'h2'>({
  as,
  children,
  ...props
}: HeadingProps<T>) {
  const Element = as ?? 'h2'
  if (!props.id) return <Element {...props}>{children}</Element>
  return (
    <Element
      {...props}
      className={[classes.root, props.className].filter(Boolean).join(' ')}
    >
      <a href={`#${props.id}`}>{children}</a>
      <ActionIcon
        component="a"
        href={`#${props.id}`}
        variant="subtle"
        color="gray"
        size="sm"
        aria-label="Link to this heading"
        className={classes.anchor}
      >
        #
      </ActionIcon>
    </Element>
  )
}
