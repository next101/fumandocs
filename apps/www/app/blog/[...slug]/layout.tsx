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

import { Container } from '@mantine/core'
import type * as PageTree from 'fumadocs-core/page-tree'
import { DocsLayout } from 'fumandocs-ui/layouts/docs'
import { brandName } from '@/components/logo'
import classes from './layout.module.css'

const blogTree: PageTree.Root = { name: 'Blog', children: [] }

export default function PostLayout({
  children,
}: LayoutProps<'/blog/[...slug]'>) {
  return (
    <Container size="xl">
      <DocsLayout
        tree={blogTree}
        nav={{ enabled: false, title: brandName }}
        sidebar={{ enabled: false }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        containerProps={{ className: classes.layout }}
      >
        {children}
      </DocsLayout>
    </Container>
  )
}
