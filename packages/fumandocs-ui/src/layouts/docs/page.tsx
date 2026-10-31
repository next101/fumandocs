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

import { Anchor, Button, Group, Menu, Paper, Text } from '@mantine/core'
import {
  ArrowSquareOutIcon,
  CaretDownIcon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
} from '@phosphor-icons/react/ssr'
import { usePathname } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import { AnchorProvider, type TOCItemType } from 'fumadocs-core/toc'
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TOCRail, TOCRailItem } from '../../components/toc'
import tocClasses from '../../components/toc.module.css'
import { useDocsLayout } from './index'
import classes from './page.module.css'
import proseClasses from './prose.module.css'

export interface DocsPageProps extends ComponentProps<'article'> {
  toc?: TOCItemType[]
  full?: boolean
  tableOfContent?: { enabled?: boolean; header?: ReactNode; footer?: ReactNode }
  tableOfContentPopover?: {
    enabled?: boolean
    header?: ReactNode
    footer?: ReactNode
  }
  footer?: { enabled?: boolean }
}

export function DocsPage({
  toc = [],
  full = false,
  tableOfContent = {},
  tableOfContentPopover = {},
  footer = {},
  children,
  className,
  ...props
}: DocsPageProps) {
  const { pages, pathname } = useDocsLayout()
  const index = pages.findIndex((page) => page.url === pathname)
  const previous = index > 0 ? pages[index - 1] : undefined
  const next =
    index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined
  const showToc = !full && tableOfContent.enabled !== false && toc.length > 0
  const showMobileToc =
    tableOfContentPopover.enabled !== false && toc.length > 0

  return (
    <AnchorProvider toc={toc}>
      {showMobileToc && (
        <details className={tocClasses.mobileToc}>
          <summary>On this page</summary>
          <nav>
            {toc.map((item) => (
              <a key={item.url} href={item.url}>
                {item.title}
              </a>
            ))}
          </nav>
        </details>
      )}
      <div
        data-no-toc={!showToc || undefined}
        className={[classes.docsGrid, !showToc && classes.docsGridNoToc]
          .filter(Boolean)
          .join(' ')}
      >
        <article
          {...props}
          data-full={full}
          className={[classes.page, className].filter(Boolean).join(' ')}
        >
          {children}
          {footer.enabled !== false && (previous || next) && (
            <div className={classes.pageFooter}>
              {previous && (
                <FooterLink page={previous} direction="Previous Page" />
              )}
              {next && <FooterLink page={next} direction="Next Page" right />}
            </div>
          )}
        </article>
        {showToc && (
          <aside className={tocClasses.root}>
            {tableOfContent.header}
            <div className={tocClasses.title}>
              <span aria-hidden>☷</span>
              <Text component="span" size="sm" c="dimmed">
                On this page
              </Text>
            </div>
            <TOCRail items={toc}>
              {toc.map((item) => (
                <TOCRailItem key={item.url} item={item} items={toc} />
              ))}
            </TOCRail>
            {tableOfContent.footer}
          </aside>
        )}
      </div>
    </AnchorProvider>
  )
}

function FooterLink({
  page,
  direction,
  right,
}: {
  page: { url: string; name: ReactNode; description?: ReactNode }
  direction: string
  right?: boolean
}) {
  return (
    <Paper
      component={Link}
      href={page.url}
      withBorder
      radius="md"
      p="md"
      className={classes.footerLink}
      style={{ textAlign: right ? 'right' : 'left' }}
    >
      <Text fw={500} size="sm">
        {right ? null : '‹ '}
        {page.name}
        {right ? ' ›' : null}
      </Text>
      <Text size="sm" c="dimmed" mt={6} truncate>
        {page.description ?? direction}
      </Text>
    </Paper>
  )
}

export function DocsTitle(props: ComponentProps<'h1'>) {
  return (
    <h1
      {...props}
      className={[classes.docsTitle, props.className].filter(Boolean).join(' ')}
    />
  )
}

export function DocsDescription(props: ComponentProps<'p'>) {
  if (props.children === undefined) return null
  return (
    <p
      {...props}
      className={[classes.docsDescription, props.className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export function DocsBody(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-prose
      className={[proseClasses.prose, props.className]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

export function MarkdownCopyButton({
  markdownUrl,
  children,
  className,
  ...props
}: ComponentProps<typeof Button> & {
  markdownUrl: string
  children?: ReactNode
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      variant="default"
      color="gray"
      size="compact-sm"
      leftSection={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      onClick={async () => {
        const markdown = await fetch(markdownUrl).then((response) =>
          response.text()
        )
        await navigator.clipboard.writeText(markdown)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
      {...props}
      className={[classes.pageAction, className].filter(Boolean).join(' ')}
    >
      {children ?? (copied ? 'Copied' : 'Copy Markdown')}
    </Button>
  )
}

function GitHubBrandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function SciraIcon() {
  return (
    <svg viewBox="0 0 910 934" width="16" height="16" fill="none" aria-hidden>
      <title>Scira AI</title>
      <path
        d="M647.664 197.775C569.13 189.049 525.5 145.419 516.774 66.8849C508.048 145.419 464.418 189.049 385.884 197.775C464.418 206.501 508.048 250.131 516.774 328.665C525.5 250.131 569.13 206.501 647.664 197.775Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M857.5 508.116C763.259 497.644 710.903 445.288 700.432 351.047C689.961 445.288 637.605 497.644 543.364 508.116C637.605 518.587 689.961 570.943 700.432 665.184C710.903 570.943 763.259 518.587 857.5 508.116Z"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinejoin="round"
      />
      <path
        d="M889.949 121.237C831.049 114.692 798.326 81.9698 791.782 23.0692C785.237 81.9698 752.515 114.692 693.614 121.237C752.515 127.781 785.237 160.504 791.782 219.404C798.326 160.504 831.049 127.781 889.949 121.237Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M760.632 764.337C720.719 814.616 669.835 855.1 611.872 882.692C553.91 910.285 490.404 924.255 426.213 923.533C362.022 922.812 298.846 907.419 241.518 878.531C184.19 849.643 134.228 808.026 95.4548 756.863C56.6815 705.7 30.1238 646.346 17.8129 583.343C5.50207 520.339 7.76433 455.354 24.4266 393.359C41.089 331.364 71.7099 274.001 113.947 225.658C156.184 177.315 208.919 139.273 268.117 114.442"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatGptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
    >
      <title>OpenAI</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  )
}

function ClaudeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
    >
      <title>Anthropic</title>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  )
}

function CursorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden
    >
      <title>Cursor</title>
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  )
}

export function ViewOptionsPopover({
  markdownUrl,
  githubUrl,
}: {
  markdownUrl?: string
  githubUrl?: string
}) {
  const pathname = usePathname()
  const items = useMemo(() => {
    /* v8 ignore next -- SSR-only guard; browsers and tests always have window. */
    const pageUrl =
      typeof window === 'undefined'
        ? pathname
        : new URL(pathname, window.location.origin).toString()
    const q = `Read ${pageUrl}, I want to ask questions about it.`
    const list: { title: string; href: string; icon: ReactNode }[] = []
    if (githubUrl) {
      list.push({
        title: 'Open in GitHub',
        href: githubUrl,
        icon: <GitHubBrandIcon />,
      })
    }
    if (markdownUrl) {
      list.push({
        title: 'View as Markdown',
        href: markdownUrl,
        icon: <FileTextIcon size={16} />,
      })
    }
    list.push(
      {
        title: 'Open in Scira AI',
        href: `https://scira.ai/?${new URLSearchParams({ q })}`,
        icon: <SciraIcon />,
      },
      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({ prompt: q, hints: 'search' })}`,
        icon: <ChatGptIcon />,
      },
      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({ q })}`,
        icon: <ClaudeIcon />,
      },
      {
        title: 'Open in Cursor',
        href: `https://cursor.com/link/prompt?${new URLSearchParams({ text: q })}`,
        icon: <CursorIcon />,
      }
    )
    return list
  }, [githubUrl, markdownUrl, pathname])

  return (
    <Menu width={230} position="bottom-start" shadow="md">
      <Menu.Target>
        <Button
          variant="default"
          color="gray"
          size="compact-sm"
          className={classes.pageAction}
          rightSection={<CaretDownIcon size={14} />}
        >
          Open
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item) => (
          <Menu.Item
            key={item.href}
            component="a"
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            leftSection={item.icon}
            rightSection={<ArrowSquareOutIcon size={14} />}
          >
            {item.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

export function EditOnGitHub(props: ComponentProps<'a'>) {
  return (
    <Anchor target="_blank" rel="noreferrer" {...props}>
      {props.children ?? 'Edit on GitHub'}
    </Anchor>
  )
}

export function PageLastUpdate({
  date,
  ...props
}: Omit<ComponentProps<'p'>, 'children'> & { date: Date }) {
  const [text, setText] = useState('')
  useEffect(() => setText(date.toLocaleDateString()), [date])
  return (
    <Text component="p" c="dimmed" size="sm" {...props}>
      Last updated on {text}
    </Text>
  )
}

export function PageActions({ children }: { children?: ReactNode }) {
  return children ? <div className={classes.pageActions}>{children}</div> : null
}

export function PageBreadcrumb({ children }: { children?: ReactNode }) {
  return children ? (
    <Group gap="xs" mb="md">
      {children}
    </Group>
  ) : null
}

export function withArticle(props: ComponentProps<'main'>) {
  return (
    <main
      {...props}
      className={[classes.standalonePage, props.className]
        .filter(Boolean)
        .join(' ')}
    >
      <DocsBody>{props.children}</DocsBody>
    </main>
  )
}
