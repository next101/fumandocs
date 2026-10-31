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

'use client'

import * as Primitive from 'fumadocs-core/toc'
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import classes from './toc.module.css'
import {
  type ComputedRail,
  computeItemLineLengths,
  computeRailPath,
  computeThumbOffsetDistance,
  getItemOffset,
  getLineOffset,
  isThumbMovingUp,
  type PathMeasure,
  type RailSegment,
  type ThumbTrackState,
} from './toc-geometry'

// Port of upstream fumadocs-ui's TOC rail ("ragged" left border): each item
// draws its rail segment as an inline SVG with cubic elbows between depth
// levels, and an absolutely positioned thumb track renders the active range
// in the primary color plus a small dot traveling along the path.

interface ComputedSVG extends ComputedRail {
  content: ReactNode
  itemLineLengths: RailSegment[]
}

function createPathMeasure(d: string): PathMeasure {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  return {
    getTotalLength: () => path.getTotalLength(),
    getPointAtLength: (length) => path.getPointAtLength(length),
  }
}

export interface TOCRailProps extends ComponentProps<'div'> {
  items: Primitive.TOCItemType[]
  thumbBox?: boolean
}

export function TOCRail({
  items,
  thumbBox = true,
  className,
  children,
  ...props
}: TOCRailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<ComputedSVG | null>(null)

  const onPrint = useCallback(() => {
    const container = containerRef.current
    if (!container || container.clientHeight === 0) return
    if (items.length === 0) {
      setSvg(null)
      return
    }
    const measurements = items.flatMap((item) => {
      const element: HTMLElement | null = container.querySelector(
        `a[href="${item.url}"]`
      )
      if (!element) return []

      const styles = getComputedStyle(element)
      return [
        {
          depth: item.depth,
          top: element.offsetTop + parseFloat(styles.paddingTop),
          bottom:
            element.offsetTop +
            element.clientHeight -
            parseFloat(styles.paddingBottom),
        },
      ]
    })

    const rail = computeRailPath(measurements)
    const itemLineLengths = thumbBox
      ? computeItemLineLengths(rail.positions, createPathMeasure(rail.d))
      : []

    setSvg({
      ...rail,
      content: (
        <path
          key="path"
          d={rail.d}
          className={classes.thumbStroke}
          strokeWidth="1"
          fill="none"
        />
      ),
      itemLineLengths,
    })
  }, [items, thumbBox])

  useEffect(() => {
    const container = containerRef.current
    /* v8 ignore next -- the ref is always attached by the time effects run. */
    if (!container) return

    const observer = new ResizeObserver(onPrint)
    observer.observe(container)
    onPrint()
    return () => {
      observer.unobserve(container)
    }
  }, [onPrint])

  return (
    <div
      ref={containerRef}
      className={[classes.rail, className].filter(Boolean).join(' ')}
      {...props}
    >
      {svg && <ThumbTrack computed={svg} thumbBox={thumbBox} />}
      {children}
    </div>
  )
}

function ThumbTrack({
  computed,
  thumbBox,
}: {
  computed: ComputedSVG
  thumbBox: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const previousRef = useRef<ThumbTrackState>(null)
  const tocInfo = Primitive.useTOC()

  function calculate(items: Primitive.TOCItemInfo[]) {
    const out: Record<string, string> = {}
    const startIdx = items.findIndex((item) => item.active)
    if (startIdx === -1) return out

    const endIdx = items.findLastIndex((item) => item.active)
    out['--track-top'] = `${computed.positions[startIdx][0]}px`
    out['--track-bottom'] = `${computed.positions[endIdx][1]}px`

    if (thumbBox) {
      const isUp = isThumbMovingUp(previousRef.current, startIdx, endIdx)
      previousRef.current = { startIdx, endIdx, isUp }
      out['--offset-distance'] =
        `${computeThumbOffsetDistance(computed.itemLineLengths, startIdx, endIdx, isUp)}px`
      out['--opacity'] =
        items[isUp ? startIdx : endIdx].original._step !== undefined ? '0' : '1'
    }

    return out
  }

  Primitive.useTOCListener((items) => {
    const element = ref.current
    if (!element) return

    for (const [k, v] of Object.entries(calculate(items))) {
      element.style.setProperty(k, v)
    }
  })

  return (
    <div
      ref={ref}
      className={classes.thumb}
      style={{
        width: computed.width,
        height: computed.height,
        ...calculate(tocInfo.get()),
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${computed.width} ${computed.height}`}
        className={classes.thumbSvg}
        aria-hidden
        style={{
          width: computed.width,
          height: computed.height,
          clipPath: `polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))`,
        }}
      >
        {computed.content}
      </svg>
      {thumbBox && (
        <div
          className={classes.thumbDot}
          style={{
            offsetPath: `path("${computed.d}")`,
          }}
        />
      )}
    </div>
  )
}

export function TOCRailItem({
  item,
  items,
  ...props
}: Primitive.TOCItemProps & {
  item: Primitive.TOCItemType
  items: Primitive.TOCItemType[]
}) {
  const { isFirst, isLast, svg } = useMemo(() => {
    const index = items.indexOf(item)
    const isFirst = index === 0
    const isLast = index === items.length - 1

    const l1 = getLineOffset(item.depth)
    const l0 = isFirst ? l1 : getLineOffset(items[index - 1].depth)
    const l2 = isLast ? l1 : getLineOffset(items[index + 1].depth)

    return {
      isFirst,
      isLast,
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={[classes.railSvg, l1 !== l2 && classes.railSvgClipped]
            .filter(Boolean)
            .join(' ')}
          aria-hidden
          style={{
            width: Math.max(l0, l1) + 9,
          }}
        >
          {l0 !== l1 && (
            <path
              d={`M ${l0 + 0.5} 0 C ${l0 + 0.5} 8 ${l1 + 0.5} 4 ${l1 + 0.5} 12`}
              strokeWidth="1"
              fill="none"
              className={classes.railStroke}
            />
          )}
          <line
            x1={l1 + 0.5}
            y1={l0 === l1 ? '6' : '12'}
            x2={l1 + 0.5}
            y2="100%"
            strokeWidth="1"
            className={classes.railStroke}
          />
        </svg>
      ),
    }
  }, [items, item])

  return (
    <Primitive.TOCItem
      href={item.url}
      {...props}
      className={[
        classes.link,
        isFirst && classes.linkFirst,
        isLast && classes.linkLast,
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        paddingInlineStart: getItemOffset(item.depth),
        ...props.style,
      }}
    >
      {svg}
      {item.title}
    </Primitive.TOCItem>
  )
}
