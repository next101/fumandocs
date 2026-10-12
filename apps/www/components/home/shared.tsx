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

import {
  Anchor,
  Button,
  type ButtonProps,
  FloatingIndicator,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core'
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { type ReactNode, useRef, useState } from 'react'
import classes from './shared.module.css'

// Passing component={Link} from a server component to a Mantine Button
// crosses the server/client boundary with a function prop, which React
// forbids — wrap it in a client component instead.
export function LinkButton({ href, ...props }: ButtonProps & { href: string }) {
  return <Button component={Link} href={href} {...props} />
}

export interface HomeFeatureData {
  icon: ReactNode
  title: string
  description: string
}

function HomeFeature({ icon, title, description }: HomeFeatureData) {
  return (
    <section className={classes.feature}>
      <ThemeIcon className={classes.featureIcon} size={50} radius="md">
        {icon}
      </ThemeIcon>
      <div>
        <Text component="h3" className={classes.featureTitle}>
          {title}
        </Text>
        <Text className={classes.featureDescription}>{description}</Text>
      </div>
    </section>
  )
}

export function HomeFeatures({ data }: { data: HomeFeatureData[] }) {
  return (
    <div className={classes.features}>
      {data.map((feature) => (
        <HomeFeature key={feature.title} {...feature} />
      ))}
    </div>
  )
}

export function LearnMore({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: ReactNode
}) {
  if (external) {
    return (
      <Anchor
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes.learnMore}
      >
        <span className={classes.learnMoreInner}>
          {children}
          <ArrowUpRightIcon size={16} />
        </span>
      </Anchor>
    )
  }

  return (
    <Anchor component={Link} href={href} className={classes.learnMore}>
      <span className={classes.learnMoreInner}>
        {children}
        <ArrowUpRightIcon size={16} />
      </span>
    </Anchor>
  )
}

export interface HomeTabData {
  label: string
  value: string
  content: ReactNode
}

export function HomeTabs({ data }: { data: HomeTabData[] }) {
  const [selected, setSelected] = useState(data[0])
  const [listRef, setListRef] = useState<HTMLDivElement | null>(null)
  // Callback refs get a new function identity every render, so nodes live in
  // a ref object and we only re-render when a node actually attaches —
  // setState in an unguarded ref callback would loop (React error #185).
  const controlsRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [, forceUpdate] = useState(0)

  const setControlRef = (value: string) => (node: HTMLButtonElement | null) => {
    if (node && controlsRefs.current[value] !== node) {
      controlsRefs.current[value] = node
      forceUpdate((t) => t + 1)
    }
  }

  return (
    <div>
      <div className={classes.tabsControls} ref={setListRef}>
        {data.map((item) => (
          <UnstyledButton
            key={item.value}
            onClick={() => setSelected(item)}
            ref={setControlRef(item.value)}
            className={classes.tabsControl}
            mod={{ active: selected.value === item.value }}
          >
            <span className={classes.tabsControlLabel}>{item.label}</span>
          </UnstyledButton>
        ))}
        <FloatingIndicator
          target={controlsRefs.current[selected.value]}
          parent={listRef}
          className={classes.tabsIndicator}
        />
      </div>
      <div className={classes.tabsContent}>{selected.content}</div>
    </div>
  )
}
