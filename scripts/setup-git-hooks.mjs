// `prepare` runs on every install, and some of those installs are not inside a
// checkout: the Docker build context carries no `.git`, and node:bookworm-slim
// carries no git binary at all, so the bare `lefthook install` used to take the
// whole `pnpm install` down with it.
//
// Gate the hook install on git actually reporting a work tree. Inside a checkout
// nothing changes — lefthook's own failures still fail the install.
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

function isWorkTree() {
  try {
    const out = execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      stdio: 'pipe',
    })
    return out.toString().trim() === 'true'
  } catch {
    // No git on PATH, or not a repository.
    return false
  }
}

if (!isWorkTree()) {
  process.stdout.write(
    'setup-git-hooks: not a git work tree, skipping `lefthook install`\n'
  )
  process.exit(0)
}

// Resolve the shim rather than relying on `node_modules/.bin` being on PATH.
const lefthook = path.join(
  import.meta.dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'lefthook.cmd' : 'lefthook'
)

execFileSync(lefthook, ['install'], { stdio: 'inherit' })
