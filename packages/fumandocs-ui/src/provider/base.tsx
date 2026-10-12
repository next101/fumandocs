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
  MantineProvider,
  type MantineProviderProps,
  type MantineThemeOverride,
} from '@mantine/core'
import type { ReactNode } from 'react'
import { type SearchOptions, SearchProvider } from '../search'
import classes from './base.module.css'

export interface RootProviderProps {
  children?: ReactNode
  dir?: 'ltr' | 'rtl'
  search?: SearchOptions
  theme?: MantineThemeOverride
  mantine?: Omit<MantineProviderProps, 'children' | 'theme'>
}

export function RootProvider({
  children,
  dir = 'ltr',
  search = {},
  theme,
  mantine,
}: RootProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto" {...mantine}>
      <div dir={dir} className={classes.root}>
        <SearchProvider {...search}>{children}</SearchProvider>
      </div>
    </MantineProvider>
  )
}

export { useMantineColorScheme as useTheme } from '@mantine/core'
