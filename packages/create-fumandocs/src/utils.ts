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
import path from 'node:path'
import { x } from 'tinyexec'

export async function copy(
  from: string,
  to: string,
  options: {
    rename?: (s: string) => string
    filter?: (s: string) => boolean
    filterDir?: (dir: string) => boolean
  } = {}
): Promise<void> {
  const {
    rename = (s) => s,
    filterDir = () => true,
    filter = () => true,
  } = options
  const stats = await fs.stat(from)

  if (stats.isDirectory() && filterDir(from)) {
    const files = await fs.readdir(from)
    await Promise.all(
      files.map((file) =>
        copy(path.join(from, file), path.join(to, file), options)
      )
    )
  }

  if (stats.isFile() && filter(from)) {
    to = rename(to)
    await fs.mkdir(path.dirname(to), { recursive: true })
    await fs.copyFile(from, to)
  }
}

async function isInGitRepository(cwd: string) {
  const { exitCode } = await x('git', ['rev-parse', '--is-inside-work-tree'], {
    nodeOptions: { cwd },
  })
  return exitCode === 0
}

async function isDefaultBranchSet(cwd: string) {
  const { exitCode } = await x('git', ['config', 'init.defaultBranch'], {
    nodeOptions: { cwd },
  })
  return exitCode === 0
}

export async function tryGitInit(cwd: string): Promise<boolean> {
  const { exitCode } = await x('git', ['--version'])
  if (exitCode !== 0) return false
  if (await isInGitRepository(cwd)) return false

  try {
    await x('git', ['init'], { throwOnError: true, nodeOptions: { cwd } })
    if (!(await isDefaultBranchSet(cwd))) {
      await x('git', ['checkout', '-b', 'main'], {
        throwOnError: true,
        nodeOptions: { cwd },
      })
    }
    await x('git', ['add', '-A'], { throwOnError: true, nodeOptions: { cwd } })
    await x('git', ['commit', '-m', 'Initial commit from create-fumandocs'], {
      throwOnError: true,
      nodeOptions: { cwd },
    })
    return true
  } catch {
    return false
  }
}
