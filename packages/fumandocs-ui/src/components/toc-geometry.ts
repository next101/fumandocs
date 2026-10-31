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

// Geometry for the TOC rail. Kept free of DOM access so the path math can be
// tested; callers pass measurements in and get SVG coordinates out.

export const BASE = 8

export type RailPosition = [top: number, bottom: number, x: number]
export type RailSegment = [top: number, bottom: number]

export interface RailMeasurement {
  depth: number
  top: number
  bottom: number
}

export interface ComputedRail {
  width: number
  height: number
  d: string
  positions: RailPosition[]
}

export interface PathMeasure {
  getTotalLength(): number
  getPointAtLength(length: number): { y: number }
}

export interface ThumbTrackState {
  startIdx: number
  endIdx: number
  isUp: boolean
}

export function getItemOffset(depth: number): number {
  if (depth <= 2) return 12 + BASE
  if (depth === 3) return 24 + BASE
  return 36 + BASE
}

export function getLineOffset(depth: number): number {
  if (depth <= 2) return BASE
  if (depth === 3) return 8 + BASE
  return 16 + BASE
}

export function computeRailPath(measurements: RailMeasurement[]): ComputedRail {
  let width = 0
  let height = 0
  let d = ''
  const positions: RailPosition[] = []

  for (let i = 0; i < measurements.length; i++) {
    const { depth, top, bottom } = measurements[i]
    const x = getLineOffset(depth) + 0.5

    width = Math.max(x + 8, width)
    height = Math.max(height, bottom)

    if (i === 0) {
      d += ` M${x} ${top} L${x} ${bottom}`
    } else {
      const [, upperBottom, upperX] = positions[i - 1]
      d += ` C ${upperX} ${top - 4} ${x} ${upperBottom + 4} ${x} ${top} L${x} ${bottom}`
    }

    positions.push([top, bottom, x])
  }

  return { width, height, d, positions }
}

export function computeItemLineLengths(
  positions: RailPosition[],
  measure: PathMeasure
): RailSegment[] {
  const itemLineLengths: RailSegment[] = []
  const total = measure.getTotalLength()

  for (let i = 0; i < positions.length; i++) {
    const [top, bottom] = positions[i]
    let length =
      i > 0 ? itemLineLengths[i - 1][1] + (top - positions[i - 1][1]) : top
    while (length < total && measure.getPointAtLength(length).y < top) length++
    itemLineLengths.push([length, length + bottom - top])
  }

  return itemLineLengths
}

export function isThumbMovingUp(
  previous: ThumbTrackState | null,
  startIdx: number,
  endIdx: number
): boolean {
  if (!previous) return false
  return (
    previous.startIdx > startIdx ||
    previous.endIdx > endIdx ||
    (previous.startIdx === startIdx &&
      previous.endIdx === endIdx &&
      previous.isUp)
  )
}

export function computeThumbOffsetDistance(
  itemLineLengths: RailSegment[],
  startIdx: number,
  endIdx: number,
  isUp: boolean
): number {
  return isUp ? itemLineLengths[startIdx][0] : itemLineLengths[endIdx][1]
}
