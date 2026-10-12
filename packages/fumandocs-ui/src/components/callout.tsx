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

import { Box, Paper, type PaperProps, Text } from '@mantine/core'
import {
  CheckCircleIcon,
  InfoIcon,
  LightbulbIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import classes from './callout.module.css'

export type CalloutType =
  | 'info'
  | 'warn'
  | 'warning'
  | 'error'
  | 'success'
  | 'idea'

export interface CalloutContainerProps extends Omit<PaperProps, 'title'> {
  type?: CalloutType
  title?: ReactNode
  icon?: ReactNode
  children?: ReactNode
}

function normalizeType(type: CalloutType) {
  return type === 'warn' ? 'warning' : type
}

const defaultIcons: Record<ReturnType<typeof normalizeType>, ReactNode> = {
  info: <InfoIcon size={14} aria-hidden />,
  warning: <WarningIcon size={14} aria-hidden />,
  error: <XCircleIcon size={14} aria-hidden />,
  success: <CheckCircleIcon size={14} aria-hidden />,
  idea: <LightbulbIcon size={14} aria-hidden />,
}

export function Callout({
  title,
  children,
  type = 'info',
  icon,
  ...props
}: CalloutContainerProps) {
  const resolved = normalizeType(type)
  const iconEl = (
    <span className={classes.icon} aria-hidden>
      {icon ?? defaultIcons[resolved]}
    </span>
  )
  return (
    <Paper
      withBorder
      radius="xs"
      {...props}
      data-type={resolved}
      className={[classes.root, props.className].filter(Boolean).join(' ')}
    >
      <span className={classes.bar} aria-hidden />
      {title ? (
        <Box className={classes.content}>
          <div className={classes.header}>
            {iconEl}
            <CalloutTitle>{title}</CalloutTitle>
          </div>
          <CalloutDescription>{children}</CalloutDescription>
        </Box>
      ) : (
        <>
          {iconEl}
          <Box className={classes.content}>
            <CalloutDescription>{children}</CalloutDescription>
          </Box>
        </>
      )}
    </Paper>
  )
}

export function CalloutContainer(props: CalloutContainerProps) {
  return <Callout {...props} />
}

export function CalloutTitle({ children }: { children?: ReactNode }) {
  return (
    <Text fw={500} size="sm" className={classes.title}>
      {children}
    </Text>
  )
}

export function CalloutDescription({ children }: { children?: ReactNode }) {
  return <div className={classes.description}>{children}</div>
}
