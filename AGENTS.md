# AGENTS.md

Working notes for contributors and coding agents in the Fumandocs monorepo. See
@README.md for the public overview and @package.json for the command surface.

## What this is

Fumandocs is a [Mantine](https://mantine.dev) UI layer for
[Fumadocs](https://fumadocs.dev) documentation sites, with no Tailwind CSS. It
publishes two npm packages (a UI adapter and a scaffolding CLI) plus an internal
TypeScript config preset, and dogfoods the whole stack through the docs site in
`apps/www`.

Upstream Fumadocs guides apply here by swapping the package name: wherever they
say `fumadocs-ui`, use `fumandocs-ui` — for the subpaths we actually export.

## Packages

| Path                        | Package            | Role                                                                            |
| --------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| `packages/fumandocs-ui`     | `fumandocs-ui`     | Mantine adapter: docs layout, page primitives, provider, search, MDX components |
| `packages/create-fumandocs` | `create-fumandocs` | CLI that scaffolds a Next.js + Fumadocs MDX + Mantine site                      |
| `packages/tsconfig`         | `tsconfig`         | Internal `base` / `node` / `react` tsconfig presets                             |
| `apps/www`                  | `fumandocs-www`    | Marketing site + docs; not published, builds against `dist`                     |

## Commands

Prerequisites: Node >= 22 and pnpm 11.13.0 (CI pins that version).

| Command                        | Effect                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `pnpm install`                 | Install workspace deps; also installs lefthook hooks when in a git work tree  |
| `pnpm build`                   | `pnpm -r run build` — tsdown for both packages                                |
| `pnpm dev`                     | `fumandocs-ui` in tsdown watch mode                                           |
| `pnpm dev:site`                | Build `fumandocs-ui`, then `next dev` on `apps/www`                           |
| `pnpm lint` / `lint:fix`       | Biome check / check `--write --unsafe`                                        |
| `pnpm format:prose` / `:fix`   | Prettier over `**/*.{md,mdx}`                                                 |
| `pnpm types:check`             | `pnpm -r run types:check` (each package's `tsc --noEmit`)                     |
| `pnpm test` / `test:watch`     | Vitest run / watch (two projects: Node + jsdom)                               |
| `pnpm test:cov`                | Vitest with V8 coverage; enforces the thresholds (CI runs this)               |
| `pnpm license:check` / `:add`  | Verify / add MIT headers via `scripts/addlicense.mjs`                         |
| `pnpm exports:check`           | Fail if our export subpaths escape upstream's surface                         |
| `pnpm exports:diff`            | Print the export-parity report (`-- --write-docs` regenerates the docs block) |
| `pnpm template:versions:check` | Verify template `workspace:` deps have pinned versions                        |
| `pnpm build:site`              | Regenerate export docs, build UI, build www                                   |
| `pnpm release`                 | commit-and-tag-version across root + both packages                            |

Run the scaffolder from source with
`pnpm --filter create-fumandocs dev <name> --no-git`.

## Architecture notes

### `fumandocs-ui` is a published library, not an app

- Built with tsdown using `unbundle: true` (preserveModules) so the
  `'use client'` directives survive into `dist`. Do not "optimise" that away.
- All component CSS is extracted into the single `dist/style.css` that consumers
  load via `import 'fumandocs-ui/style.css'`. `css.splitting` is deliberately
  off.
- Importability is governed by the `exports` map in its `package.json`. Adding a
  file under `src/` does not make it a public subpath — add an `exports` entry
  too.
- Peer deps (`@mantine/core`, `fumadocs-core`, `next`, React) are peers, not
  deps; only `@phosphor-icons/react` and `rehype-raw` ship as real dependencies.

### Export parity is a hard constraint

`scripts/compare-fumadocs-ui-exports.mjs` compares our `exports` against the
official `fumadocs-ui` and `@fumadocs/base-ui` on npm (needs network).

- `pnpm exports:check` fails if we export a subpath upstream does not have, or
  if a path `apps/www` imports is missing from our exports. The only allowlisted
  extra is `./search` (see `INTENTIONAL_EXTRA_EXPORTS`); add new deliberate
  extras there with a comment.
- The `EXPORT-PARITY:START/END` JSX-comment block in
  `apps/www/content/docs/export-compatibility.mdx` is generated. Never hand-edit
  inside the markers; `pnpm exports:diff -- --write-docs` or `pnpm build:site`
  rewrites it.
- Upstream version is read from `packages/create-fumandocs/src/versions.json`
  (the `fumadocs-core` range) unless `UPSTREAM_FUMADOCS_UI_VERSION` overrides
  it.

### `apps/www` is the only in-repo dogfood app

It consumes `fumandocs-ui` as `workspace:fumandocs-ui@*` and resolves the
**built `dist`**, not `src`. That is why its `dev`, `build`, and `types:check`
scripts all run `pnpm --filter fumandocs-ui build` first. After editing UI
source, rebuild before expecting the site to change.

### `create-fumandocs` copies a template and rewrites it

`create()` in `packages/create-fumandocs/src/create.ts`:

1. Copies `template/fumandocs-example` to the target, renaming
   `example.gitignore` → `.gitignore` (git would never commit a template
   `.gitignore`).
2. Rewrites `package.json`: sets `name`, replaces the scripts, and resolves
   every `workspace:` dependency to a pinned version from `src/versions.json`
   (`fumandocs-ui` is pinned from its own package version by `constants.ts`). An
   unresolvable `workspace:` dep throws.
3. Replaces the `'__PROJECT_NAME__'` token (quotes included, which keeps it
   valid TS) in `.ts .tsx .md .json .mjs .css` files it copies.
4. Optionally installs dependencies and runs `git init` + initial commit.

Hard invariants:

- `template/fumandocs-example/app/docs/layout.tsx` **must** still contain the
  `'__PROJECT_NAME__'` token; `create()` throws if the replacement pass did not
  touch it.
- Adding a `workspace:` dependency to the template requires a matching entry in
  `src/versions.json`, or both `pnpm template:versions:check` and real
  scaffolding break.
- The template mirrors `apps/www` heavily but is **not** generated from it. Keep
  them in sync by hand.
- Template files deliberately carry no MIT header — they become the user's code.

### TypeScript

Extend the internal presets (`tsconfig/base.json`, `node.json`, `react.json`)
rather than writing a fresh tsconfig. `apps/www` and the template set
`paths: { "@/*": ["./*"] }`.

## Conventions

- **Biome** formats and lints everything code-ish: single quotes, no semicolons,
  80 columns, 2-space indent, ES5 trailing commas, sorted imports, React and
  Next domains enabled. Prettier owns Markdown/MDX only (`printWidth: 80`,
  `proseWrap: always`).
- **License headers** are enforced. Every file under the patterns in
  `scripts/addlicense.mjs` needs the MIT block; run `pnpm license:add`. Not
  applicable to template files or `**/versions.json`.
- **Commits** follow Conventional Commits (commitlint on `commit-msg`).
- **Git hooks** (lefthook): pre-commit runs biome `--write` on staged
  js/ts/tsx/json/css, `license:check`, and prettier `--write` on staged md/mdx;
  pre-push runs `types:check`. `scripts/setup-git-hooks.mjs` skips hook install
  outside a git work tree so Docker builds do not fail.
- Comments are rare and explain _why_, not _what_. Match the surrounding code.

## Testing

`pnpm test` runs Vitest. `vitest.config.ts` defines two projects: a Node project
for `create-fumandocs` and a jsdom project for `fumandocs-ui`. `vitest.setup.ts`
registers jest-dom matchers and stubs `ResizeObserver`, `IntersectionObserver`,
and `matchMedia`. Tests sit next to the code as `*.test.ts(x)` under each
package's `src/`, carry the MIT header like any other source file, and are
excluded from the `fumandocs-ui` tsdown entry so they never reach `dist`.

- `create.test.ts` scaffolds into a temp directory and asserts the package
  rewrite: name, script swap, `workspace:` pinning, `.gitignore` rename, and
  `__PROJECT_NAME__` replacement.
- Component tests cover branch logic in `callout`, `card`, `codeblock`,
  `heading`, `mdx`, and `DocsPage` pagination.
- `toc-geometry.test.ts` and `page-tree.test.ts` cover logic extracted from
  `toc.tsx` and `docs-layout.tsx`. Keep that math in those pure modules — jsdom
  has no `getTotalLength`, `getPointAtLength`, `offsetTop`, or `clientHeight`,
  so it cannot be tested through the component.

`test.yml` runs lint, prose format, license headers, export parity, template
version check, `tsc --noEmit`, `pnpm test:cov`, package builds, and the
docs-site build. The last behavioural check is the scaffold smoke test:

```
build dist/bin.js → scaffold smoke-app --no-git
→ grep -q "'smoke-app'" smoke-app/components/logo.tsx
→ pnpm install && pnpm build in the generated app
```

That end-to-end run is still the only thing that proves the template compiles,
so keep it. Not covered by unit tests: CSS and visual output (needs Playwright)
and anything that depends on real layout.

### Coverage

`pnpm test:cov` uses the V8 provider (`@vitest/coverage-v8`, pinned to the same
version as `vitest` — it is not bundled) and writes `text`, `json`, and `html`
reports to the gitignored `coverage/` directory. Thresholds live in
`vitest.config.ts` and are **100% on lines, statements, branches, and
functions**. Do not lower them to make a change pass.

Two deliberate exemptions:

- `create-fumandocs/src/bin.ts` carries `/* v8 ignore file */`. It is a process
  entry point — parses `process.argv`, prompts through `@clack/prompts`, and
  calls `process.exit` — and the scaffold smoke test below covers it end to end.
- A few statements carry `/* v8 ignore next */` with the reason inline: the SSR
  guard in `page.tsx`, the always-attached ref guard in `toc.tsx`, the
  unreachable footer guard in `docs-layout.tsx`, and the defensive copy fallback
  in `codeblock.tsx`.

Excluded from the denominator: test files, `*.d.ts`, `*.module.css`, barrels
(`index.ts`/`index.tsx`), and the type-only `layouts/shared.ts`.

Vitest only honours statement-level hints (`v8 ignore file`, `v8 ignore next`);
a hint inside an expression does not drop an operand branch, so unreachable `??`
fallbacks need a statement-level guard instead.

## Common workflows

**Try a scaffold before releasing**

```bash
pnpm build
node packages/create-fumandocs/dist/bin.js my-test-app --no-git
cd my-test-app && pnpm install && pnpm build
```

**Change the UI and view it**

```bash
pnpm dev               # terminal 1: rebuild fumandocs-ui on change
pnpm --filter fumandocs-www dev   # terminal 2: next dev
```

`pnpm dev:site` is the one-shot alternative; it builds the UI once, so further
UI edits need another build.

**Cut a release**

`pnpm release` bumps the root and both package `package.json` files, then push
the `v*` tag. `publish.yml` reuses `test.yml` as a gate, publishes with npm OIDC
trusted publishing (no `NPM_TOKEN`), and opens a GitHub release with changelog
notes from `scripts/extract-changelog.sh`.

## Gotchas

- `packages/create-fumandocs/my-docs/` and root `/smoke-app/` are gitignored
  local scaffold output. Their `node_modules` trees will pollute naive `grep -r`
  / glob searches — exclude `node_modules` explicitly.
- `fd-shots/` and `logo-drafts/` are gitignored scratch space for screenshots
  and logo experiments.
- Next 16 typed routes are used (`LayoutProps<'/docs'>`), so `types:check` runs
  `next typegen` before `tsc`.
- The docs site builds to a static export; `apps/www/out/` is generated.
