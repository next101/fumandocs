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
import { defaultModules, type ModuleId } from './modules'

export interface CreateOptions {
  outputDir: string
  modules?: ModuleId[]
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

/** Placeholder in template text files, replaced with the project name. */
const PROJECT_NAME_TOKEN = "'__PROJECT_NAME__'"

const TEXT_FILE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.md',
  '.mdx',
  '.json',
  '.mjs',
  '.css',
])

/** Files that may contain `@modules` comment blocks. */
const MODULE_MARKER_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.md', '.mdx'])

const MODULE_START_MARKER =
  /^\s*(?:\/\/|\/\*|\{\/\*|<!--)\s*@modules\s+([\w, -]+?)\s*(?:\*\/|\*\/\}|-->)?\s*$/

const MODULE_END_MARKER =
  /^\s*(?:\/\/|\/\*|\{\/\*|<!--)\s*@modules-end\s*(?:\*\/|\*\/\}|-->)?\s*$/

export async function create(createOptions: CreateOptions): Promise<void> {
  const {
    outputDir,
    modules: requestedModules = defaultModules,
    packageManager = 'npm',
    initializeGit = false,
    installDeps = false,
    log = console.log,
  } = createOptions

  const modules = [...new Set(requestedModules)]
  if (modules.length === 0) {
    throw new Error('At least one module is required: docs or blog')
  }

  const projectName = path.basename(outputDir)

  // Resolved per call rather than at import time, so tests can point sourceDir
  // at a fixture template.
  const templateRoot = path.join(sourceDir, 'template', 'fumandocs-example')
  const baseDir = path.join(templateRoot, 'base')
  const modulesDir = path.join(templateRoot, 'modules')
  const overridesDir = path.join(templateRoot, 'overrides')

  await copy(baseDir, outputDir, {
    rename(file) {
      return file.replace('example.gitignore', '.gitignore')
    },
  })

  for (const moduleId of modules) {
    await copy(path.join(modulesDir, moduleId), outputDir)
  }

  // A blog-only site uses the post list as its home page.
  if (modules.length === 1 && modules[0] === 'blog') {
    await fs.copyFile(
      path.join(overridesDir, 'blog-only-page.tsx'),
      path.join(outputDir, 'app', 'page.tsx')
    )
  }

  const sitemapOverride =
    modules.length > 1 ? 'sitemap-both.ts' : `sitemap-${modules[0]}.ts`
  await fs.copyFile(
    path.join(overridesDir, sitemapOverride),
    path.join(outputDir, 'app', 'sitemap.ts')
  )

  await applyModuleFilters(outputDir, modules)

  const packageJsonPath = path.join(outputDir, 'package.json')
  const packageJson = await initPackageJson(
    projectName,
    packageJsonPath,
    modules
  )
  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  )

  const readmePath = path.join(outputDir, 'README.md')
  const readme = await fs.readFile(readmePath, 'utf8')
  await fs.writeFile(readmePath, `# ${projectName}\n\n${readme}`)

  const replacedFiles = await applyProjectName(outputDir, projectName)
  if (!replacedFiles.includes(path.join('components', 'logo.tsx'))) {
    throw new Error(
      `Template components/logo.tsx is missing the ${PROJECT_NAME_TOKEN} placeholder`
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
  packageJsonPath: string,
  modules: ModuleId[]
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

  const dependencies = replaceDeps(
    packageJson.dependencies as Record<string, string>
  )
  if (modules.includes('blog') && !('zod' in dependencies)) {
    dependencies.zod = depVersions.zod
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
    dependencies,
    devDependencies: replaceDeps(
      packageJson.devDependencies as Record<string, string>
    ),
  }
}

/**
 * Strip `@modules <ids>` … `@modules-end` blocks whose modules are disabled.
 * The markers are comments so the template files stay valid TypeScript, JSX,
 * CSS and Markdown.
 */
function filterModuleBlocks(source: string, enabled: Set<string>): string {
  const output: string[] = []
  const stack: boolean[] = []

  for (const line of source.split(/\r?\n/)) {
    const start = line.match(MODULE_START_MARKER)
    if (start) {
      const ids = start[1].split(/[,\s]+/).filter(Boolean)
      stack.push(ids.some((id) => enabled.has(id)))
      continue
    }

    if (MODULE_END_MARKER.test(line)) {
      stack.pop()
      continue
    }

    if (stack.every(Boolean)) output.push(line)
  }

  return output.join('\n').replace(/\n{3,}/g, '\n\n')
}

async function applyModuleFilters(
  outputDir: string,
  modules: ModuleId[]
): Promise<void> {
  const enabled = new Set<string>(modules)
  const entries = await fs.readdir(outputDir, {
    withFileTypes: true,
    recursive: true,
  })

  for (const entry of entries) {
    if (!entry.isFile()) continue
    if (!MODULE_MARKER_EXTENSIONS.has(path.extname(entry.name))) continue

    const filePath = path.join(entry.parentPath, entry.name)
    const content = await fs.readFile(filePath, 'utf8')
    if (!content.includes('@modules')) continue

    await fs.writeFile(filePath, filterModuleBlocks(content, enabled))
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
