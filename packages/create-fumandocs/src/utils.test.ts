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

import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { copy } from './utils'

const tempDirs: string[] = []

async function tempDir() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'fumandocs-utils-'))
  tempDirs.push(dir)
  return dir
}

async function writeFile(root: string, name: string, content = 'x') {
  const file = path.join(root, name)
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content)
  return file
}

async function exists(file: string) {
  return fs
    .access(file)
    .then(() => true)
    .catch(() => false)
}

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { recursive: true, force: true }))
  )
})

describe('copy', () => {
  it('copies a directory tree', async () => {
    const from = await tempDir()
    await writeFile(from, 'a.txt')
    await writeFile(from, 'sub/b.txt')
    const to = await tempDir()

    await copy(from, to)

    expect(await exists(path.join(to, 'a.txt'))).toBe(true)
    expect(await exists(path.join(to, 'sub', 'b.txt'))).toBe(true)
  })

  it('renames paths through the rename option', async () => {
    const from = await tempDir()
    await writeFile(from, 'example.gitignore')
    const to = await tempDir()

    await copy(from, to, {
      rename: (file) => file.replace('example.gitignore', '.gitignore'),
    })

    expect(await exists(path.join(to, '.gitignore'))).toBe(true)
    expect(await exists(path.join(to, 'example.gitignore'))).toBe(false)
  })

  it('skips filtered files', async () => {
    const from = await tempDir()
    await writeFile(from, 'keep.txt')
    await writeFile(from, 'skip.txt')
    const to = await tempDir()

    await copy(from, to, {
      filter: (file) => !file.endsWith('skip.txt'),
    })

    expect(await exists(path.join(to, 'keep.txt'))).toBe(true)
    expect(await exists(path.join(to, 'skip.txt'))).toBe(false)
  })

  it('skips filtered directories', async () => {
    const from = await tempDir()
    await writeFile(from, 'keep.txt')
    await writeFile(from, 'skip/inside.txt')
    const to = await tempDir()

    await copy(from, to, {
      filterDir: (dir) => !dir.endsWith('skip'),
    })

    expect(await exists(path.join(to, 'keep.txt'))).toBe(true)
    expect(await exists(path.join(to, 'skip', 'inside.txt'))).toBe(false)
  })
})
