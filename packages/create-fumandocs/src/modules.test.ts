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

import { describe, expect, it } from 'vitest'
import { defaultModules, moduleIds, parseModules } from './modules'

describe('moduleIds', () => {
  it('lists the supported modules', () => {
    expect(moduleIds).toEqual(['docs', 'blog'])
  })

  it('enables docs by default', () => {
    expect(defaultModules).toEqual(['docs'])
  })
})

describe('parseModules', () => {
  it('parses a comma separated list', () => {
    expect(parseModules('docs,blog')).toEqual(['docs', 'blog'])
  })

  it('trims entries and drops empty ones', () => {
    expect(parseModules(' docs , , blog ')).toEqual(['docs', 'blog'])
  })

  it('removes duplicates while keeping order', () => {
    expect(parseModules('blog,blog,docs')).toEqual(['blog', 'docs'])
  })

  it('rejects an unknown module', () => {
    expect(() => parseModules('docs,news')).toThrow(
      'Unknown module: news. Choose from docs, blog.'
    )
  })

  it('pluralises multiple unknown modules', () => {
    expect(() => parseModules('news,shop')).toThrow(
      'Unknown modules: news, shop. Choose from docs, blog.'
    )
  })

  it('rejects an empty selection', () => {
    expect(() => parseModules('  ,  ')).toThrow(
      'Select at least one module: docs or blog.'
    )
  })
})
