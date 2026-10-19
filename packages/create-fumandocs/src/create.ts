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
import { copy, tryGitInit } from '@/utils'
import type { PackageManager } from './auto-install'
import { autoInstall } from './auto-install'
import { depVersions, sourceDir } from './constants'

export interface CreateOptions {
  outputDir: string
  packageManager?: PackageManager
  installDeps?: boolean
  initializeGit?: boolean
  log?: (message: string) => void
}

type PackageJson = {
  name?: string
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
} & Record<string, unknown>

const TEMPLATE_DIR = 'fumandocs-example'

/** Placeholder in template text files, replaced with the project name. */
const PROJECT_NAME_TOKEN = "'__PROJECT_NAME__'"

const TEXT_FILE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.md',
  '.json',
  '.mjs',
  '.css',
])

export async function create(createOptions: CreateOptions): Promise<void> {
  const {
    outputDir,
    packageManager = 'npm',
    initializeGit = false,
    installDeps = false,
    log = console.log,
  } = createOptions

  const projectName = path.basename(outputDir)

  await copy(path.join(sourceDir, 'template', TEMPLATE_DIR), outputDir, {
    rename(file) {
      return file.replace('example.gitignore', '.gitignore')
    },
  })

  const packageJsonPath = path.join(outputDir, 'package.json')
  const packageJson = await initPackageJson(projectName, packageJsonPath)
  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  )

  const readmePath = path.join(outputDir, 'README.md')
  const readme = await fs.readFile(readmePath, 'utf8')
  await fs.writeFile(readmePath, `# ${projectName}\n\n${readme}`)

  const replacedFiles = await applyProjectName(outputDir, projectName)
  if (!replacedFiles.includes(path.join('app', 'docs', 'layout.tsx'))) {
    throw new Error(
      `Template app/docs/layout.tsx is missing the ${PROJECT_NAME_TOKEN} placeholder`
    )
  }

  if (installDeps) {
    try {
      await autoInstall(packageManager, outputDir)
      log('Installed dependencies')
    } catch (err) {
      log(`Failed to install dependencies: ${err}`)
    }
  }

  if (initializeGit && (await tryGitInit(outputDir))) {
    log('Initialized Git repository')
  }
}

async function initPackageJson(
  projectName: string,
  packageJsonPath: string
): Promise<PackageJson> {
  const packageJson: PackageJson = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8')
  )

  function replaceDeps(deps: Record<string, string> = {}) {
    const next: Record<string, string> = {}
    for (const [key, value] of Object.entries(deps)) {
      if (value.startsWith('workspace:')) {
        if (key in depVersions) {
          next[key] = depVersions[key]
          continue
        }
        const raw = value.slice('workspace:'.length)
        const name = raw.replace(/@\*$/, '')
        if (name in depVersions) {
          next[key] = depVersions[name]
          continue
        }
        throw new Error(
          `Template dependency "${key}" uses "${value}" but has no pinned version in src/versions.json`
        )
      }
      next[key] = value
    }
    return next
  }

  return {
    ...packageJson,
    name: projectName,
    scripts: {
      build: 'next build',
      dev: 'next dev',
      start: 'next start',
      'types:check': 'next typegen && tsc --noEmit',
    },
    dependencies: replaceDeps(
      packageJson.dependencies as Record<string, string>
    ),
    devDependencies: replaceDeps(
      packageJson.devDependencies as Record<string, string>
    ),
  }
}

/**
 * Replace the project name placeholder in every template text file.
 * Returns the scaffolded files (relative paths) that contained it.
 */
async function applyProjectName(
  outputDir: string,
  projectName: string
): Promise<string[]> {
  const replacedFiles: string[] = []
  const value = /^[A-Za-z0-9._-]+$/.test(projectName)
    ? `'${projectName}'`
    : JSON.stringify(projectName)
  const entries = await fs.readdir(outputDir, {
    withFileTypes: true,
    recursive: true,
  })

  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (!TEXT_FILE_EXTENSIONS.has(path.extname(entry.name))) continue

    const filePath = path.join(entry.parentPath, entry.name)
    const content = await fs.readFile(filePath, 'utf8')
    if (!content.includes(PROJECT_NAME_TOKEN)) continue

    await fs.writeFile(filePath, content.replaceAll(PROJECT_NAME_TOKEN, value))
    replacedFiles.push(path.relative(outputDir, filePath))
  }

  return replacedFiles
}
