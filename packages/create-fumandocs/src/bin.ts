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

import fs from 'node:fs/promises'
import path from 'node:path'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  spinner,
  text,
} from '@clack/prompts'
import { Option, program } from '@commander-js/extra-typings'
import pc from 'picocolors'
import { getPackageManager, managers } from './auto-install'
import { isCI } from './constants'
import { create } from './index'

const command = program
  .argument('[name]', 'project directory name')
  .option('--install', 'install dependencies after scaffolding')
  .option('--no-git', 'skip git init')
  .addOption(
    new Option('--pm <name>', 'package manager for --install')
      .choices([...managers])
      .default(getPackageManager())
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

  let installDeps = config.install ?? false
  if (config.install === undefined && !isCI) {
    const answer = await confirm({
      message: `Install dependencies with ${config.pm}?`,
      initialValue: true,
    })
    if (isCancel(answer)) {
      cancel('Cancelled.')
      process.exit(0)
    }
    installDeps = answer
  }

  const initializeGit = config.git !== false && !isCI

  const info = spinner()
  info.start('Generating project…')

  try {
    await create({
      outputDir,
      packageManager: config.pm,
      installDeps,
      initializeGit,
      log: (msg) => info.message(msg),
    })
    info.stop('Project created')
  } catch (err) {
    info.stop(pc.red('Failed'))
    console.error(err)
    process.exit(1)
  }

  outro(
    `Next:\n  cd ${projectName}\n  ${installDeps ? '' : `${config.pm} install\n  `}${config.pm} run dev`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
