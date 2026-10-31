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

import { x } from 'tinyexec'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoInstall, getPackageManager } from './auto-install'

vi.mock('tinyexec', () => ({ x: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(x).mockReset()
})

describe('getPackageManager', () => {
  it.each([
    ['yarn/1.22.19', 'yarn'],
    ['pnpm/11.13.0', 'pnpm'],
    ['bun/1.2.0', 'bun'],
    ['npm/10.0.0 node/v22.0.0', 'npm'],
  ] as const)('reads %s as %s', (userAgent, expected) => {
    vi.stubEnv('npm_config_user_agent', userAgent)

    expect(getPackageManager()).toBe(expected)
  })

  it('falls back to npm without a user agent', () => {
    const previous = process.env.npm_config_user_agent
    delete process.env.npm_config_user_agent

    try {
      expect(getPackageManager()).toBe('npm')
    } finally {
      if (previous !== undefined) process.env.npm_config_user_agent = previous
    }
  })
})

describe('autoInstall', () => {
  it('runs the manager install in the target directory', async () => {
    vi.mocked(x).mockResolvedValue({ exitCode: 0 } as never)

    await autoInstall('pnpm', '/tmp/app')

    expect(x).toHaveBeenCalledWith(
      'pnpm',
      ['install'],
      expect.objectContaining({
        throwOnError: true,
        nodeOptions: expect.objectContaining({ cwd: '/tmp/app' }),
      })
    )
  })

  it('propagates install failures', async () => {
    vi.mocked(x).mockRejectedValue(new Error('install failed'))

    await expect(autoInstall('npm', '/tmp/app')).rejects.toThrow(
      'install failed'
    )
  })
})
