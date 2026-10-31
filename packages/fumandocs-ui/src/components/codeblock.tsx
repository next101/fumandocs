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

import { ActionIcon, Group, Paper, Tabs, Text } from '@mantine/core'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react/ssr'
import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import classes from './codeblock.module.css'

export interface CodeBlockProps
  extends Omit<ComponentProps<'figure'>, 'title'> {
  title?: ReactNode
  icon?: ReactNode
  allowCopy?: boolean | 'true' | 'false'
  viewportProps?: HTMLAttributes<HTMLDivElement>
  keepBackground?: boolean
}

export function Pre(props: ComponentProps<'pre'>) {
  return <pre {...props} />
}

export function CodeBlock({
  title,
  icon,
  allowCopy = true,
  viewportProps,
  children,
  ...props
}: CodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const viewport = ref.current
    const content =
      viewport?.querySelector('pre')?.textContent ?? viewport?.textContent
    /* v8 ignore next -- defensive: the button only renders with a mounted viewport. */
    if (content === undefined) return

    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Paper
      component="figure"
      withBorder
      radius="xs"
      {...props}
      className={[classes.root, props.className].filter(Boolean).join(' ')}
    >
      {(title || icon) && (
        <Group className={classes.header} gap="xs">
          {icon}
          <Text component="figcaption" size="sm" fw={500}>
            {title}
          </Text>
        </Group>
      )}
      <div className={classes.body}>
        <div
          ref={ref}
          {...viewportProps}
          className={[classes.viewport, viewportProps?.className]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
        {allowCopy !== false && allowCopy !== 'false' && (
          <ActionIcon
            onClick={copy}
            variant="subtle"
            color="gray"
            className={classes.copyButton}
            aria-label="Copy code"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          </ActionIcon>
        )}
      </div>
    </Paper>
  )
}

export interface CodeBlockTabsProps
  extends Omit<ComponentProps<typeof Tabs>, 'groupId' | 'persist'> {
  groupId?: string
  persist?: boolean
}

export function CodeBlockTabs({
  className,
  groupId,
  persist,
  ...props
}: CodeBlockTabsProps) {
  // groupId/persist are Fumadocs-style shared/persistent tab props.
  // Mantine Tabs doesn't recognize them, so we strip them from the DOM.
  void groupId
  void persist
  return (
    <Tabs
      keepMounted={false}
      {...props}
      className={[classes.codeTabs, className].filter(Boolean).join(' ')}
    />
  )
}

export function CodeBlockTabsList(props: ComponentProps<typeof Tabs.List>) {
  return <Tabs.List {...props} />
}

export function CodeBlockTabsTrigger(props: ComponentProps<typeof Tabs.Tab>) {
  return <Tabs.Tab {...props} />
}

export function CodeBlockTab(props: ComponentProps<typeof Tabs.Panel>) {
  return <Tabs.Panel {...props} />
}
