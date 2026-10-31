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

import type * as PageTree from 'fumadocs-core/page-tree'

export function flattenPages(nodes: PageTree.Node[]): PageTree.Item[] {
  const pages: PageTree.Item[] = []
  for (const node of nodes) {
    if (node.type === 'page') pages.push(node)
    if (node.type === 'folder') {
      if (node.index) pages.push(node.index)
      pages.push(...flattenPages(node.children))
    }
  }
  return pages
}

export function folderContains(
  folder: PageTree.Folder,
  pathname: string
): boolean {
  return (
    Boolean(folder.index && isNestedActive(folder.index.url, pathname)) ||
    folder.children.some((node) =>
      node.type === 'folder'
        ? folderContains(node, pathname)
        : node.type === 'page' && isNestedActive(node.url, pathname)
    )
  )
}

// Sidebar items are highlighted only on an exact URL match, mirroring
// upstream fumadocs-ui (`isActive(url, pathname, false)`).
export function isActive(url: string, pathname: string): boolean {
  return pathname === url
}

// Nested matching is only used to decide whether a folder should open.
export function isNestedActive(url: string, pathname: string): boolean {
  return pathname === url || (url !== '/' && pathname.startsWith(`${url}/`))
}
