/**
 * Verify that every workspace: dependency in the create-fumandocs template
 * has a resolvable pinned version in src/versions.json (or the fumandocs-ui
 * package version), matching the replacement logic in src/create.ts.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = path.join(root, 'packages', 'create-fumandocs')
const templatePkg = JSON.parse(
  fs.readFileSync(
    path.join(pkgDir, 'template', 'fumandocs-example', 'package.json'),
    'utf8'
  )
)
const versions = JSON.parse(
  fs.readFileSync(path.join(pkgDir, 'src', 'versions.json'), 'utf8')
)

const failures = []

for (const depGroup of ['dependencies', 'devDependencies']) {
  for (const [name, value] of Object.entries(templatePkg[depGroup] ?? {})) {
    if (!value.startsWith('workspace:')) continue

    if (name in versions) continue

    const raw = value.slice('workspace:'.length)
    const depName = raw.replace(/@\*$/, '')
    if (depName === 'fumandocs-ui') continue // pinned from the package version

    failures.push(
      `Template ${depGroup}: "${name}" uses "${value}" but has no pinned version in src/versions.json`
    )
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('Template dependency versions are in sync')
