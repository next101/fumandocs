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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tryGitInit } from '@/utils'
import uiPackage from '../../fumandocs-ui/package.json'
import { autoInstall } from './auto-install'
import { type CreateOptions, create } from './create'

vi.mock('./auto-install', () => ({ autoInstall: vi.fn() }))
vi.mock('@/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/utils')>()
  return { ...actual, tryGitInit: vi.fn() }
})

const tempDirs: string[] = []

async function createProject(name = 'my-app') {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), 'fumandocs-create-'))
  tempDirs.push(parent)
  const outputDir = path.join(parent, name)
  await create({ outputDir })
  return outputDir
}

async function createProjectWith(options: Partial<CreateOptions> = {}) {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), 'fumandocs-create-'))
  tempDirs.push(parent)
  const outputDir = path.join(parent, 'my-app')
  await create({ outputDir, ...options })
  return outputDir
}

async function readJson(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

afterEach(async () => {
  await Promise.all(
    tempDirs
      .splice(0)
      .map((dir) => fs.rm(dir, { recursive: true, force: true }))
  )
})

describe('create', () => {
  it('names the generated package after the output directory', async () => {
    const outputDir = await createProject('my-app')
    const packageJson = await readJson(path.join(outputDir, 'package.json'))

    expect(packageJson.name).toBe('my-app')
  })

  it('replaces the template scripts', async () => {
    const outputDir = await createProject()
    const packageJson = await readJson(path.join(outputDir, 'package.json'))

    expect(packageJson.scripts).toEqual({
      build: 'next build',
      dev: 'next dev',
      start: 'next start',
      'types:check': 'next typegen && tsc --noEmit',
    })
  })

  it('pins every workspace dependency', async () => {
    const outputDir = await createProject()
    const packageJson = await readJson(path.join(outputDir, 'package.json'))

    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }
    for (const [name, version] of Object.entries<string>(deps)) {
      expect(version, name).not.toContain('workspace:')
    }
    expect(packageJson.dependencies['fumandocs-ui']).toBe(
      `^${uiPackage.version}`
    )
  })

  it('renames the template gitignore', async () => {
    const outputDir = await createProject()

    await expect(fs.access(path.join(outputDir, '.gitignore'))).resolves.toBe(
      undefined
    )
    await expect(
      fs.access(path.join(outputDir, 'example.gitignore'))
    ).rejects.toThrow()
  })

  it('replaces the project name token in template files', async () => {
    const outputDir = await createProject('my-app')

    const layout = await fs.readFile(
      path.join(outputDir, 'app', 'docs', 'layout.tsx'),
      'utf8'
    )
    const logo = await fs.readFile(
      path.join(outputDir, 'components', 'logo.tsx'),
      'utf8'
    )

    expect(layout).toContain("'my-app'")
    expect(layout).not.toContain('__PROJECT_NAME__')
    expect(logo).not.toContain('__PROJECT_NAME__')
  })

  it('prefixes the README with the project name', async () => {
    const outputDir = await createProject('my-app')
    const readme = await fs.readFile(path.join(outputDir, 'README.md'), 'utf8')

    expect(readme.startsWith('# my-app\n')).toBe(true)
  })

  it('does not install dependencies or initialise git by default', async () => {
    const outputDir = await createProject()

    await expect(fs.access(path.join(outputDir, '.git'))).rejects.toThrow()
    await expect(
      fs.access(path.join(outputDir, 'node_modules'))
    ).rejects.toThrow()
  })
})

describe('create optional steps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('installs dependencies when requested', async () => {
    vi.mocked(autoInstall).mockResolvedValue(undefined)
    const log = vi.fn()

    const outputDir = await createProjectWith({
      installDeps: true,
      packageManager: 'pnpm',
      log,
    })

    expect(autoInstall).toHaveBeenCalledWith('pnpm', outputDir)
    expect(log).toHaveBeenCalledWith('Installed dependencies')
  })

  it('reports install failures without throwing', async () => {
    vi.mocked(autoInstall).mockRejectedValue(new Error('nope'))
    const log = vi.fn()

    await expect(
      createProjectWith({ installDeps: true, log })
    ).resolves.toBeTruthy()
    expect(log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to install dependencies')
    )
  })

  it('initialises git when requested', async () => {
    vi.mocked(tryGitInit).mockResolvedValue(true)
    const log = vi.fn()

    await createProjectWith({ initializeGit: true, log })

    expect(tryGitInit).toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith('Initialized Git repository')
  })

  it('stays quiet when git initialisation is skipped', async () => {
    vi.mocked(tryGitInit).mockResolvedValue(false)
    const log = vi.fn()

    await createProjectWith({ initializeGit: true, log })

    expect(log).not.toHaveBeenCalledWith('Initialized Git repository')
  })
})
