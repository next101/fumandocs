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
import {
  computeItemLineLengths,
  computeRailPath,
  computeThumbOffsetDistance,
  getItemOffset,
  getLineOffset,
  isThumbMovingUp,
  type PathMeasure,
} from './toc-geometry'

function linearMeasure(total: number): PathMeasure {
  return {
    getTotalLength: () => total,
    getPointAtLength: (length) => ({ y: length }),
  }
}

function halfSpeedMeasure(total: number): PathMeasure {
  return {
    getTotalLength: () => total,
    getPointAtLength: (length) => ({ y: length / 2 }),
  }
}

describe('offsets', () => {
  it.each([
    [1, 20, 8],
    [2, 20, 8],
    [3, 32, 16],
    [4, 44, 24],
  ])('depth %i gets item offset %i and line offset %i', (depth, item, line) => {
    expect(getItemOffset(depth)).toBe(item)
    expect(getLineOffset(depth)).toBe(line)
  })
})

describe('computeRailPath', () => {
  it('draws a straight segment for a single item', () => {
    const rail = computeRailPath([{ depth: 2, top: 0, bottom: 10 }])

    expect(rail).toEqual({
      width: 16.5,
      height: 10,
      d: ' M8.5 0 L8.5 10',
      positions: [[0, 10, 8.5]],
    })
  })

  it('draws a cubic elbow between depth levels', () => {
    const rail = computeRailPath([
      { depth: 2, top: 0, bottom: 10 },
      { depth: 3, top: 10, bottom: 20 },
    ])

    expect(rail.d).toBe(' M8.5 0 L8.5 10 C 8.5 6 16.5 14 16.5 10 L16.5 20')
    expect(rail.width).toBe(24.5)
    expect(rail.height).toBe(20)
    expect(rail.positions).toEqual([
      [0, 10, 8.5],
      [10, 20, 16.5],
    ])
  })

  it('returns an empty rail when there is nothing to draw', () => {
    expect(computeRailPath([])).toEqual({
      width: 0,
      height: 0,
      d: '',
      positions: [],
    })
  })
})

describe('computeItemLineLengths', () => {
  it('measures each item on a linear path', () => {
    const lengths = computeItemLineLengths(
      [
        [0, 10, 8.5],
        [10, 20, 8.5],
      ],
      linearMeasure(100)
    )

    expect(lengths).toEqual([
      [0, 10],
      [10, 20],
    ])
  })

  it('advances until the path reaches the item top', () => {
    const lengths = computeItemLineLengths(
      [
        [0, 10, 8.5],
        [20, 30, 8.5],
      ],
      halfSpeedMeasure(100)
    )

    expect(lengths).toEqual([
      [0, 10],
      [40, 50],
    ])
  })
})

describe('isThumbMovingUp', () => {
  it('is false for the first observation', () => {
    expect(isThumbMovingUp(null, 1, 2)).toBe(false)
  })

  it('moves up when the range starts earlier', () => {
    expect(isThumbMovingUp({ startIdx: 2, endIdx: 3, isUp: false }, 1, 3)).toBe(
      true
    )
  })

  it('moves up when the range ends earlier', () => {
    expect(isThumbMovingUp({ startIdx: 1, endIdx: 3, isUp: false }, 1, 2)).toBe(
      true
    )
  })

  it('alternates direction when the range is unchanged', () => {
    expect(isThumbMovingUp({ startIdx: 1, endIdx: 2, isUp: true }, 1, 2)).toBe(
      true
    )
    expect(isThumbMovingUp({ startIdx: 1, endIdx: 2, isUp: false }, 1, 2)).toBe(
      false
    )
  })

  it('moves down when the range advances', () => {
    expect(isThumbMovingUp({ startIdx: 1, endIdx: 2, isUp: false }, 2, 3)).toBe(
      false
    )
  })
})

describe('computeThumbOffsetDistance', () => {
  const lengths: [number, number][] = [
    [0, 10],
    [10, 20],
    [20, 30],
  ]

  it('uses the end of the active range when moving down', () => {
    expect(computeThumbOffsetDistance(lengths, 1, 2, false)).toBe(30)
  })

  it('uses the start of the active range when moving up', () => {
    expect(computeThumbOffsetDistance(lengths, 1, 2, true)).toBe(10)
  })
})
