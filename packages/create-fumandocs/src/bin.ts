#!/usr/bin/env node
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

/* v8 ignore file -- process entry point: parses argv, prompts, and exits.
 * Covered end to end by the scaffold smoke test. */

import fs from 'node:fs/promises'
import path from 'node:path'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import { Option, program } from '@commander-js/extra-typings'
import pc from 'picocolors'
import {
  getPackageManager,
  managers,
  type PackageManager,
} from './auto-install'
import { isCI } from './constants'
import { create, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_URL } from './index'
import { defaultModules, type ModuleId, parseModules } from './modules'

const command = program
  .argument('[name]', 'project directory name')
  .option('--modules <list>', 'modules to include, comma separated (docs,blog)')
  .option('--title <text>', 'site title (defaults to the project name)')
  .option('--description <text>', 'site description')
  .option('--url <url>', 'public site URL')
  .option('--install', 'install dependencies after scaffolding')
  .addOption(
    new Option('--pm <name>', 'package manager to use').choices([...managers])
  )

async function checkDir(name: string): Promise<void> {
  const dest = path.resolve(process.cwd(), name)
  try {
    await fs.access(dest)
    cancel(`Directory "${name}" already exists.`)
    process.exit(1)
  } catch {
    // ok
  }
}

async function askText(
  message: string,
  defaultValue: string,
  validate?: (value: string) => string | undefined
): Promise<string> {
  const answer = await text({
    message,
    defaultValue,
    placeholder: defaultValue,
    validate: validate ? (value) => validate(value ?? '') : undefined,
  })
  if (isCancel(answer)) {
    cancel('Cancelled.')
    process.exit(0)
  }
  return answer.trim()
}

function flagValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function validateSiteUrl(value: string): string | undefined {
  try {
    const { protocol } = new URL(value)
    if (protocol === 'http:' || protocol === 'https:') return undefined
  } catch {
    // Not a URL at all.
  }
  return 'Enter an http(s) URL'
}

async function main(): Promise<void> {
  command.parse(process.argv)
  const defaultName = command.args[0]
  const config = command.opts()

  intro(pc.bgMagenta(pc.bold(' create-fumandocs ')))

  let name = defaultName
  if (!name) {
    if (isCI) {
      name = 'my-docs'
    } else {
      const answer = await text({
        message: 'Project name',
        placeholder: 'my-docs',
        defaultValue: 'my-docs',
      })
      if (isCancel(answer)) {
        cancel('Cancelled.')
        process.exit(0)
      }
      name = answer
    }
  }

  const projectName = name.replace(/\s+/g, '-')
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/.test(projectName)) {
    cancel(
      `Invalid project name "${name}": use letters, digits, and - . _ only`
    )
    process.exit(1)
  }
  const outputDir = path.resolve(process.cwd(), projectName)

  if (!isCI) await checkDir(projectName)

  let modules: ModuleId[]
  if (config.modules !== undefined) {
    try {
      modules = parseModules(config.modules)
    } catch (err) {
      cancel((err as Error).message)
      process.exit(1)
    }
  } else if (isCI) {
    modules = defaultModules
  } else {
    const answer = await multiselect<ModuleId>({
      message: 'Which modules do you want to create?',
      options: [
        { value: 'docs', label: 'Docs', hint: 'Documentation site at /docs' },
        {
          value: 'blog',
          label: 'Blog',
          hint: 'Blog with a post list at /blog',
        },
      ],
      initialValues: defaultModules,
      required: false,
    })
    if (isCancel(answer)) {
      cancel('Cancelled.')
      process.exit(0)
    }
    modules = answer
    if (modules.length === 0) {
      cancel('Select at least one module: docs or blog.')
      process.exit(0)
    }
  }

  const siteTitle =
    flagValue(config.title) ??
    (isCI ? projectName : await askText('Site title', projectName))

  const siteDescription =
    flagValue(config.description) ??
    (isCI
      ? DEFAULT_SITE_DESCRIPTION
      : await askText('Site description', DEFAULT_SITE_DESCRIPTION))

  const urlFlag = flagValue(config.url)
  if (urlFlag !== undefined) {
    const error = validateSiteUrl(urlFlag)
    if (error) {
      cancel(`Invalid site URL "${urlFlag}": ${error}`)
      process.exit(1)
    }
  }

  const siteUrl =
    urlFlag ??
    (isCI
      ? DEFAULT_SITE_URL
      : await askText('Site URL', DEFAULT_SITE_URL, validateSiteUrl))

  let packageManager = config.pm
  if (packageManager === undefined) {
    if (isCI) {
      packageManager = getPackageManager()
    } else {
      const answer = await select<PackageManager>({
        message: 'Package manager',
        options: managers.map((pm) => ({ value: pm, label: pm })),
        initialValue: getPackageManager(),
      })
      if (isCancel(answer)) {
        cancel('Cancelled.')
        process.exit(0)
      }
      packageManager = answer
    }
  }

  let installDeps = config.install ?? false
  if (config.install === undefined && !isCI) {
    const answer = await confirm({
      message: `Install dependencies with ${packageManager}?`,
      initialValue: true,
    })
    if (isCancel(answer)) {
      cancel('Cancelled.')
      process.exit(0)
    }
    installDeps = answer
  }

  const info = spinner()
  info.start('Generating project…')

  try {
    await create({
      outputDir,
      modules,
      siteTitle,
      siteDescription,
      siteUrl,
      packageManager,
      installDeps,
      log: (msg) => info.message(msg),
    })
    info.stop('Project created')
  } catch (err) {
    info.stop(pc.red('Failed'))
    console.error(err)
    process.exit(1)
  }

  outro(
    `Next:\n  cd ${projectName}\n  git init\n  ${installDeps ? '' : `${packageManager} install\n  `}${packageManager} run dev`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
