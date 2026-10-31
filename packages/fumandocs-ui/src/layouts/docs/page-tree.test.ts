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
import { describe, expect, it } from 'vitest'
import {
  flattenPages,
  folderContains,
  isActive,
  isNestedActive,
} from './page-tree'

function page(name: string, url: string): PageTree.Item {
  return { type: 'page', name, url }
}

function folder(
  name: string,
  children: PageTree.Node[],
  index?: PageTree.Item
): PageTree.Folder {
  return { type: 'folder', name, children, index }
}

function separator(name: string): PageTree.Separator {
  return { type: 'separator', name }
}

describe('flattenPages', () => {
  it('walks nested folders index-first', () => {
    const nodes: PageTree.Node[] = [
      page('A', '/a'),
      folder(
        'F',
        [
          page('B', '/b'),
          folder('G', [page('C', '/c')], page('G index', '/g')),
        ],
        page('F index', '/f')
      ),
      separator('S'),
      page('D', '/d'),
    ]

    expect(flattenPages(nodes).map((item) => item.url)).toEqual([
      '/a',
      '/f',
      '/b',
      '/g',
      '/c',
      '/d',
    ])
  })

  it('skips folders that have no index', () => {
    const nodes = [folder('F', [page('B', '/b')])]

    expect(flattenPages(nodes).map((item) => item.url)).toEqual(['/b'])
  })
})

describe('folderContains', () => {
  const nested = folder(
    'F',
    [
      page('B', '/f/b'),
      folder('G', [page('C', '/f/g/c')], page('G index', '/f/g')),
    ],
    page('F index', '/f')
  )

  it('matches the folder index', () => {
    expect(folderContains(nested, '/f')).toBe(true)
  })

  it('matches a direct child page', () => {
    expect(folderContains(nested, '/f/b')).toBe(true)
  })

  it('matches a page nested two levels deep', () => {
    expect(folderContains(nested, '/f/g/c')).toBe(true)
  })

  it('matches any path beneath the folder index', () => {
    // The index url doubles as a prefix, so a missing page still opens the
    // folder. Only reachable with a pathname absent from the tree.
    expect(folderContains(nested, '/f/z')).toBe(true)
  })

  it('does not match prefix lookalikes or unrelated paths', () => {
    expect(folderContains(nested, '/fx')).toBe(false)
    expect(folderContains(nested, '/other/z')).toBe(false)
  })

  it('does not treat the folder path as active without an index', () => {
    const withoutIndex = folder('F', [page('B', '/f/b')])

    expect(folderContains(withoutIndex, '/f')).toBe(false)
  })
})

describe('isActive', () => {
  it('only matches exact URLs', () => {
    expect(isActive('/a', '/a')).toBe(true)
    expect(isActive('/a', '/a/b')).toBe(false)
  })
})

describe('isNestedActive', () => {
  it('matches the URL itself', () => {
    expect(isNestedActive('/a', '/a')).toBe(true)
  })

  it('matches descendants on a path boundary', () => {
    expect(isNestedActive('/a', '/a/b')).toBe(true)
    expect(isNestedActive('/a', '/ab')).toBe(false)
    expect(isNestedActive('/a', '/a-b')).toBe(false)
  })

  it('treats the root URL as exact-only', () => {
    expect(isNestedActive('/', '/')).toBe(true)
    expect(isNestedActive('/', '/docs')).toBe(false)
  })
})
