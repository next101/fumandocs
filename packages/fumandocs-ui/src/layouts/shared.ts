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

import type { ComponentType, ReactNode } from 'react'

export interface NavOptions {
  enabled?: boolean
  title?: ReactNode
  url?: string
  children?: ReactNode
}

export interface LinkItemType {
  text: ReactNode
  url: string
  icon?: ReactNode
  external?: boolean
  on?: 'nav' | 'menu' | 'all'
}

export interface BaseLayoutProps {
  children?: ReactNode
  githubUrl?: string
  links?: LinkItemType[]
  nav?: NavOptions
  searchToggle?: { enabled?: boolean }
  themeSwitch?: { enabled?: boolean }
}

export interface MantineDocsSlots {
  header?: ComponentType
  sidebar?: ComponentType
}
