#!/usr/bin/env node
/**
 * Compare fumandocs-ui export subpaths against official fumadocs-ui (Radix) and @fumadocs/base-ui.
 *
 * Usage:
 *   node scripts/compare-fumadocs-ui-exports.mjs
 *   node scripts/compare-fumadocs-ui-exports.mjs --write-docs
 *   node scripts/compare-fumadocs-ui-exports.mjs --json packages/fumandocs-ui/exports-diff.json
 *   node scripts/compare-fumadocs-ui-exports.mjs --check
 *
 * Env:
 *   UPSTREAM_FUMADOCS_UI_VERSION — override pinned upstream (default: fumadocs-core from create-fumandocs/src/versions.json)
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
)
const fumandocsUiPkgPath = path.join(
  repoRoot,
  'packages/fumandocs-ui/package.json'
)
const versionsPkgPath = path.join(
  repoRoot,
  'packages/create-fumandocs/src/versions.json'
)
const docsPagePath = path.join(
  repoRoot,
  'apps/www/content/docs/export-compatibility.mdx'
)

/** Import paths used by this monorepo (apps/www dogfood). */
const MONOREPO_IMPORT_PATHS = [
  './provider/next',
  './layouts/docs',
  './layouts/docs/page',
  './mdx',
  './style.css',
]

/**
 * Exports we deliberately ship even though upstream fumadocs-ui has no such
 * subpath. `--check` ignores these; everything else must stay a strict subset
 * of the official export surface.
 */
const INTENTIONAL_EXTRA_EXPORTS = new Set([
  // Mantine-native search dialog, replaces upstream's search client subpaths.
  './search',
])

/** Section order for grouped tables (matches official layout areas). */
const SECTION_ORDER = [
  'Provider',
  'Docs layout',
  'Flux layout',
  'Glass layout',
  'Notebook layout',
  'Home layout',
  'Shared layout types & slots',
  'MDX defaults',
  'Global CSS',
  'CSS extras',
  'Doc / MDX components',
  'Search dialog',
  'Sidebar',
  'TOC',
  'UI primitives (Base/Radix)',
  'Contexts',
  'Utils',
  'Internationalization',
  'Page helpers',
  'Open Graph',
  'Legacy (Radix only)',
  'Package metadata',
  'Other',
]

/** Summary rows for “missing by area” (coarser buckets). */
const AREA_BUCKETS = [
  ['layouts/flux', 'Flux layout'],
  ['layouts/glass', 'Glass layout'],
  ['layouts/notebook', 'Notebook layout'],
  ['layouts/home', 'Home / marketing layout'],
  ['layouts/docs', 'Docs layout (incl. slots)'],
  ['layouts/shared', 'Shared layout slots'],
  ['components/dialog', 'Search dialog modules'],
  ['components/sidebar', 'Sidebar building blocks'],
  ['components/toc', 'TOC variants'],
  ['components/ui', 'Radix/Base UI primitives'],
  ['provider', 'Non-Next providers'],
  ['contexts', 'React contexts'],
  ['utils', 'Layout / MDX hooks'],
  ['i18n', 'Internationalization'],
  ['og', 'Open Graph helpers'],
  ['legacy', 'Legacy Radix layout'],
  ['css', 'Extra CSS entrypoints'],
]

function parseArgs(argv) {
  const flags = {
    writeDocs: false,
    check: false,
    json: null,
    verbose: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--write-docs') flags.writeDocs = true
    else if (arg === '--check') flags.check = true
    else if (arg === '--verbose' || arg === '-v') flags.verbose = true
    else if (arg === '--json') {
      flags.json = argv[++i]
      if (!flags.json) {
        console.error('--json requires a file path')
        process.exit(1)
      }
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node scripts/compare-fumadocs-ui-exports.mjs [options]

Options:
  --write-docs     Refresh generated block in apps/www/content/docs/export-compatibility.mdx
  --json <path>    Write machine-readable report JSON
  --check          Exit 1 if fumandocs-ui exports are not a subset of official fumadocs-ui
  --verbose, -v    Print full per-path checklist to stdout
  --help           Show this help
`)
      process.exit(0)
    } else {
      console.error(`Unknown argument: ${arg}`)
      process.exit(1)
    }
  }
  return flags
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function resolveUpstreamVersion() {
  if (process.env.UPSTREAM_FUMADOCS_UI_VERSION) {
    return process.env.UPSTREAM_FUMADOCS_UI_VERSION.replace(/^v/, '')
  }
  const versions = readJson(versionsPkgPath)
  const coreRange = versions['fumadocs-core']
  if (!coreRange) {
    throw new Error(
      `Could not read fumadocs-core version from ${versionsPkgPath}`
    )
  }
  const match = String(coreRange).match(/(\d+\.\d+\.\d+)/)
  if (!match) {
    throw new Error(`Unexpected fumadocs-core range: ${coreRange}`)
  }
  return match[1]
}

function exportKeys(exportsField) {
  return Object.keys(exportsField ?? {}).sort()
}

function npmExports(packageName, version) {
  const spec = version ? `${packageName}@${version}` : packageName
  const raw = execSync(`npm view ${spec} exports --json`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return exportKeys(JSON.parse(raw))
}

function bucketPath(exportPath) {
  const normalized = exportPath.replace(/^\.\//, '')
  const parts = normalized.split('/')
  if (parts[0] === 'layouts' && parts[1]) return `layouts/${parts[1]}`
  if (parts[0] === 'components' && parts[1]) return `components/${parts[1]}`
  if (parts[0] === 'contexts') return 'contexts'
  if (parts[0] === 'provider') return 'provider'
  if (parts[0] === 'utils') return 'utils'
  if (parts[0] === 'legacy') return 'legacy'
  if (parts[0] === 'og') return 'og'
  if (parts[0] === 'css') return 'css'
  if (parts[0] === 'i18n') return 'i18n'
  return parts[0] ?? exportPath
}

function getSection(exportPath) {
  const p = exportPath
  if (p.startsWith('./provider/')) return 'Provider'
  if (p.startsWith('./layouts/docs')) return 'Docs layout'
  if (p.startsWith('./layouts/flux')) return 'Flux layout'
  if (p.startsWith('./layouts/glass')) return 'Glass layout'
  if (p.startsWith('./layouts/notebook')) return 'Notebook layout'
  if (p.startsWith('./layouts/home')) return 'Home layout'
  if (p.startsWith('./layouts/shared')) return 'Shared layout types & slots'
  if (p === './mdx') return 'MDX defaults'
  if (p === './style.css') return 'Global CSS'
  if (p.startsWith('./css/')) return 'CSS extras'
  if (p.startsWith('./components/dialog')) return 'Search dialog'
  if (p.startsWith('./components/sidebar')) return 'Sidebar'
  if (p.startsWith('./components/toc')) return 'TOC'
  if (p.startsWith('./components/ui')) return 'UI primitives (Base/Radix)'
  if (p.startsWith('./components/')) return 'Doc / MDX components'
  if (p.startsWith('./contexts/')) return 'Contexts'
  if (p.startsWith('./utils/')) return 'Utils'
  if (p === './i18n') return 'Internationalization'
  if (p === './page') return 'Page helpers'
  if (p.startsWith('./og')) return 'Open Graph'
  if (p.startsWith('./legacy/')) return 'Legacy (Radix only)'
  if (p === './package.json') return 'Package metadata'
  return 'Other'
}

function groupMissing(missingPaths) {
  const counts = new Map()
  for (const p of missingPaths) {
    const key = bucketPath(p)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const ordered = []
  for (const [prefix, label] of AREA_BUCKETS) {
    const count = counts.get(prefix)
    if (count) ordered.push({ prefix, label, count })
    counts.delete(prefix)
  }
  const rest = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([prefix, count]) => ({
      prefix,
      label: prefix,
      count,
    }))
  return [...ordered, ...rest]
}

function groupBySection(paths, oursSet, baseSet) {
  const map = new Map()
  for (const p of paths) {
    const section = getSection(p)
    if (!map.has(section)) map.set(section, [])
    map.get(section).push({
      path: p,
      inFumandocsUi: oursSet.has(p),
      inBaseUi: baseSet.has(p),
      radixOnly: !baseSet.has(p),
    })
  }
  const sections = []
  for (const name of SECTION_ORDER) {
    const entries = map.get(name)
    if (entries?.length) {
      sections.push({
        name,
        entries: entries.sort((a, b) => a.path.localeCompare(b.path)),
        implemented: entries.filter((e) => e.inFumandocsUi).length,
        total: entries.length,
      })
      map.delete(name)
    }
  }
  for (const [name, entries] of map.entries()) {
    sections.push({
      name,
      entries: entries.sort((a, b) => a.path.localeCompare(b.path)),
      implemented: entries.filter((e) => e.inFumandocsUi).length,
      total: entries.length,
    })
  }
  return sections
}

function pct(part, total) {
  if (total === 0) return '0%'
  return `${((part / total) * 100).toFixed(1)}%`
}

function buildReport() {
  const upstreamVersion = resolveUpstreamVersion()
  const oursPkg = readJson(fumandocsUiPkgPath)
  const ours = exportKeys(oursPkg.exports)
  const oursSet = new Set(ours)
  const official = npmExports('fumadocs-ui', upstreamVersion)
  const baseUi = npmExports('@fumadocs/base-ui', upstreamVersion)
  const baseSet = new Set(baseUi)

  const overlapRadix = ours.filter((p) => official.includes(p))
  const overlapBase = ours.filter((p) => baseUi.includes(p))
  const onlyOurs = ours.filter((p) => !official.includes(p))
  const missingRadix = official.filter((p) => !oursSet.has(p))
  const missingBase = baseUi.filter((p) => !oursSet.has(p))
  const radixOnly = official.filter((p) => !baseSet.has(p))
  const missingGroups = groupMissing(missingRadix)

  const officialDetails = official.map((p) => ({
    path: p,
    inFumandocsUi: oursSet.has(p),
    inBaseUi: baseSet.has(p),
    radixOnly: !baseSet.has(p),
    section: getSection(p),
  }))

  const sections = groupBySection(official, oursSet, baseSet)

  const monorepoMissing = MONOREPO_IMPORT_PATHS.filter((p) => !oursSet.has(p))

  return {
    generatedAt: new Date().toISOString(),
    upstream: {
      radixPackage: 'fumadocs-ui',
      basePackage: '@fumadocs/base-ui',
      version: upstreamVersion,
      radixExportCount: official.length,
      baseUiExportCount: baseUi.length,
      sharedBaseRadixCount: baseUi.filter((p) => official.includes(p)).length,
      radixOnlyCount: radixOnly.length,
      radixOnlyPaths: radixOnly,
    },
    fumandocsUi: {
      package: oursPkg.name,
      version: oursPkg.version,
      exportCount: ours.length,
      exports: ours,
    },
    summary: {
      overlapRadixCount: overlapRadix.length,
      overlapBaseCount: overlapBase.length,
      missingFromFumandocsUiRadixCount: missingRadix.length,
      missingFromFumandocsUiBaseCount: missingBase.length,
      onlyInFumandocsUiCount: onlyOurs.length,
      coverageBySubpathRadix: pct(overlapRadix.length, official.length),
      coverageBySubpathBase: pct(overlapBase.length, baseUi.length),
    },
    overlapRadix,
    overlapBase,
    onlyInFumandocsUi: onlyOurs,
    missingFromFumandocsUiRadix: missingRadix,
    missingFromFumandocsUiBase: missingBase,
    missingGroups,
    officialDetails,
    sections,
    monorepoImportPaths: MONOREPO_IMPORT_PATHS,
    monorepoMissingFromFumandocsUi: monorepoMissing,
  }
}

function formatImportPath(exportPath) {
  if (exportPath === './css/*') return 'fumadocs-ui/css/*'
  return exportPath.replace(/^\.\//, 'fumadocs-ui/')
}

function statusCell(yes) {
  return yes ? 'Yes' : '—'
}

function printReport(report, verbose) {
  const { upstream, fumandocsUi, summary } = report
  console.log(
    `fumandocs-ui (${fumandocsUi.version}): ${fumandocsUi.exportCount} export subpaths`
  )
  console.log(
    `official fumadocs-ui (Radix)@${upstream.version}: ${upstream.radixExportCount}`
  )
  console.log(
    `official @fumadocs/base-ui@${upstream.version}: ${upstream.baseUiExportCount}`
  )
  console.log(
    `shared Base+Radix: ${upstream.sharedBaseRadixCount}; Radix-only: ${upstream.radixOnlyCount}`
  )
  console.log('')
  console.log(
    `Overlap vs Radix: ${summary.overlapRadixCount} (${summary.coverageBySubpathRadix})`
  )
  console.log(
    `Overlap vs Base UI: ${summary.overlapBaseCount} (${summary.coverageBySubpathBase})`
  )
  console.log(`Missing vs Radix: ${summary.missingFromFumandocsUiRadixCount}`)
  console.log(`Missing vs Base UI: ${summary.missingFromFumandocsUiBaseCount}`)
  if (summary.onlyInFumandocsUiCount > 0) {
    console.log(`Only in fumandocs-ui: ${summary.onlyInFumandocsUiCount}`)
    for (const p of report.onlyInFumandocsUi) console.log(`  ${p}`)
  }
  console.log('')
  console.log('Implemented export subpaths:')
  for (const p of report.fumandocsUi.exports) console.log(`  ${p}`)
  console.log('')
  console.log('Missing by area (vs official Radix):')
  for (const g of report.missingGroups) {
    console.log(`  ${String(g.count).padStart(3)}  ${g.label}`)
  }

  if (verbose) {
    console.log('')
    console.log('Full checklist (official fumadocs-ui):')
    for (const row of report.officialDetails) {
      const mark = row.inFumandocsUi ? '✓' : '—'
      const note = row.radixOnly ? ' [Radix-only]' : ''
      console.log(`  ${mark}  ${formatImportPath(row.path)}${note}`)
    }
  }
}

function generateSectionTable(section) {
  const header = `| Import path | fumandocs-ui | @fumadocs/base-ui | Notes |
| ----------- | :----------: | :----------------: | ----- |`
  const rows = section.entries
    .map((e) => {
      const notes = e.radixOnly ? 'Radix-only' : ''
      return `| \`${formatImportPath(e.path)}\` | ${statusCell(e.inFumandocsUi)} | ${statusCell(e.inBaseUi)} | ${notes} |`
    })
    .join('\n')
  return `#### ${section.name} (${section.implemented}/${section.total})

${header}
${rows}`
}

function generateDocsBlock(report) {
  const { upstream, fumandocsUi, summary } = report

  const summaryTable = `| Package | Export subpaths |
| ------- | ---------------: |
| **fumandocs-ui** (${fumandocsUi.version}) | ${fumandocsUi.exportCount} |
| **Official \`fumadocs-ui\`** (Radix, \`packages/radix-ui\`) | ${upstream.radixExportCount} |
| **Official \`@fumadocs/base-ui\`** (\`packages/base-ui\`) | ${upstream.baseUiExportCount} |
| **Shared Base + Radix** (same import string) | ${upstream.sharedBaseRadixCount} |
| **Radix-only** (not on Base UI) | ${upstream.radixOnlyCount} |
| **Implemented on both official packages** | ${summary.overlapRadixCount} (**${summary.coverageBySubpathRadix}** of Radix) |
| **Implemented vs Base UI only** | ${summary.overlapBaseCount} (**${summary.coverageBySubpathBase}** of Base UI) |
| **Not implemented yet** (vs Radix) | ${summary.missingFromFumandocsUiRadixCount} |`

  const radixOnlyList = upstream.radixOnlyPaths
    .map((p) => `- \`${formatImportPath(p)}\``)
    .join('\n')

  const implementedRows = report.fumandocsUi.exports
    .map((p) => {
      const inBase = report.officialDetails.find((d) => d.path === p)?.inBaseUi
      return `| \`${formatImportPath(p)}\` | Yes | ${inBase ? 'Yes' : 'Radix-only'} |`
    })
    .join('\n')

  const monorepoRows = report.monorepoImportPaths
    .map((p) => {
      const ok = report.fumandocsUi.exports.includes(p)
      return `| \`${formatImportPath(p)}\` | ${ok ? 'Yes' : '**No**'} |`
    })
    .join('\n')

  const areaRows = report.missingGroups
    .map((g) => `| ${g.label} | ${g.count} |`)
    .join('\n')

  const fullChecklistHeader = `| Import path | fumandocs-ui | Base UI | Notes |
| ----------- | :----------: | :-----: | ----- |`
  const fullChecklistRows = report.officialDetails
    .map((row) => {
      const notes = row.radixOnly ? 'Radix-only' : ''
      return `| \`${formatImportPath(row.path)}\` | ${statusCell(row.inFumandocsUi)} | ${statusCell(row.inBaseUi)} | ${notes} |`
    })
    .join('\n')

  const sectionBlocks = report.sections.map(generateSectionTable).join('\n\n')

  return `{/* EXPORT-PARITY:START — generated by scripts/compare-fumadocs-ui-exports.mjs; do not edit */}

_Last compared against **\`fumadocs-ui@${upstream.version}\`** and **\`@fumadocs/base-ui@${upstream.version}\`** on npm (${report.generatedAt.slice(0, 10)}). Regenerate with \`pnpm exports:diff -- --write-docs\` or as part of \`pnpm build:site\`._

### Numbers at a glance

${summaryTable}

### Radix-only subpaths (not on \`@fumadocs/base-ui\`)

These **${upstream.radixOnlyPaths.length}** import strings exist on \`fumadocs-ui\` (Radix) but not on Base UI. Mantine adapters typically **skip** them.

${radixOnlyList}

### Implemented in \`fumandocs-ui\`

Same import path as official; implementation is Mantine.

| Import path | In Radix \`fumadocs-ui\` | In \`@fumadocs/base-ui\` |
| ----------- | ------------------------ | ------------------------- |
${implementedRows}

### Used in this monorepo

| Import path | Exported by \`fumandocs-ui\` |
| ----------- | ---------------------------- |
${monorepoRows}

### Missing vs official (by area)

Coarse buckets for the **${summary.missingFromFumandocsUiRadixCount}** Radix subpaths not exported by \`fumandocs-ui\` yet:

| Area | Missing subpaths |
| ---- | ---------------: |
${areaRows}

### Full checklist (all official \`fumadocs-ui\` subpaths)

Every subpath on **\`fumadocs-ui@${upstream.version}\`**, compared to **\`fumandocs-ui\`**.

${fullChecklistHeader}
${fullChecklistRows}

### By section

Grouped the same way as upstream layout/component areas. **Bundled behavior** (e.g. sidebar inside \`layouts/docs\`) may exist even when a granular slot subpath is **—**.

${sectionBlocks}

{/* EXPORT-PARITY:END */}`
}

function writeDocsBlock(report) {
  if (!fs.existsSync(docsPagePath)) {
    console.error(`Docs page not found: ${docsPagePath}`)
    process.exit(1)
  }
  const content = fs.readFileSync(docsPagePath, 'utf8')
  const block = generateDocsBlock(report)
  // MDX does not support HTML comments; markers are JSX comments.
  const pattern =
    /\{\/\* EXPORT-PARITY:START[\s\S]*?\{\/\* EXPORT-PARITY:END \*\/\}/
  if (!pattern.test(content)) {
    console.error(
      'export-compatibility.mdx is missing EXPORT-PARITY markers. Add START/END JSX comments.'
    )
    process.exit(1)
  }
  fs.writeFileSync(docsPagePath, content.replace(pattern, block))
  console.log(`Updated ${path.relative(repoRoot, docsPagePath)}`)
}

function runCheck(report) {
  const unexpectedExtras = report.onlyInFumandocsUi.filter(
    (p) => !INTENTIONAL_EXTRA_EXPORTS.has(p)
  )
  if (unexpectedExtras.length > 0) {
    console.error(
      'fumandocs-ui exports paths that are not in official fumadocs-ui:'
    )
    for (const p of unexpectedExtras) console.error(`  ${p}`)
    console.error(
      'If a new export is deliberate, add it to INTENTIONAL_EXTRA_EXPORTS.'
    )
    process.exit(1)
  }
  if (report.monorepoMissingFromFumandocsUi.length > 0) {
    console.error('Monorepo import paths missing from fumandocs-ui exports:')
    for (const p of report.monorepoMissingFromFumandocsUi) {
      console.error(`  ${p}`)
    }
    process.exit(1)
  }
  console.log('Export parity check passed (subset + monorepo paths).')
}

function main() {
  const flags = parseArgs(process.argv)
  const report = buildReport()
  printReport(report, flags.verbose)

  if (flags.json) {
    const outPath = path.isAbsolute(flags.json)
      ? flags.json
      : path.join(repoRoot, flags.json)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`)
    console.log(`\nWrote ${path.relative(repoRoot, outPath)}`)
  }

  if (flags.writeDocs) writeDocsBlock(report)
  if (flags.check) runCheck(report)
}

main()
