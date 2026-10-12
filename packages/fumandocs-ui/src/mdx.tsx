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

import { Table as MantineTable } from '@mantine/core'
import { Image as FrameworkImage } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import type {
  AnchorHTMLAttributes,
  FC,
  HTMLAttributes,
  ImgHTMLAttributes,
  TableHTMLAttributes,
} from 'react'
import {
  Callout,
  CalloutContainer,
  CalloutDescription,
  CalloutTitle,
} from './components/callout'
import { Card, Cards } from './components/card'
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from './components/codeblock'
import { Heading } from './components/heading'
import classes from './mdx.module.css'

function Image(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <FrameworkImage sizes="(max-width: 768px) 100vw, 800px" {...props} />
}

function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className={classes.tableScroll}>
      <MantineTable {...props} />
    </div>
  )
}

const defaultMdxComponents = {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  pre: (props: HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock>
      <Pre {...props} />
    </CodeBlock>
  ),
  Card,
  Cards,
  Callout,
  CalloutContainer,
  CalloutTitle,
  CalloutDescription,
  a: Link as FC<AnchorHTMLAttributes<HTMLAnchorElement>>,
  img: Image,
  table: Table,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h1" {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h3" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h4" {...props} />
  ),
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h5" {...props} />
  ),
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading as="h6" {...props} />
  ),
}

export const createRelativeLink: typeof import('./mdx.server').createRelativeLink =
  () => {
    throw new Error(
      '`createRelativeLink` is only supported in a server environment.'
    )
  }

export default defaultMdxComponents
