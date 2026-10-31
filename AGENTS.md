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

## Testing status

There are no unit or integration tests: no test runner is installed (no
vitest/jest anywhere) and no `test` script exists. `test.yml` is really a static

- build pipeline: lint, prose format, license headers, export parity, template
  version check, `tsc --noEmit`, package builds, docs-site build.

The only behavioural check is the scaffold smoke test at the end of CI:

```
build dist/bin.js → scaffold smoke-app --no-git
→ grep -q "'smoke-app'" smoke-app/components/logo.tsx
→ pnpm install && pnpm build in the generated app
```

Consequences worth knowing before you change things:

- A runtime branch regression in `fumandocs-ui` components is not caught by CI —
  a build only proves the export exists and types line up.
- A template mistake surfaces only after a full install + Next build, or not at
  all if the smoke test does not touch that file.
- Best-value places to add fast tests, if you are adding them: the
  `create-fumandocs` template transformations (pure-ish, no network), and branch
  logic in `components/{callout,card,codeblock,heading}.tsx` plus
  `layouts/docs/page.tsx` (prev/next boundary math). `components/toc.tsx` rail
  geometry depends on `getTotalLength`, `getPointAtLength`, and `offsetTop`,
  which jsdom does not implement — extract the measurement math first if you
  want it tested. CSS module output is only worth Playwright screenshots.

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
