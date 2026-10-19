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
  ActionIcon,
  Box,
  Button,
  Drawer,
  Group,
  Kbd,
  NavLink,
  ScrollArea,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SidebarSimpleIcon,
  SunIcon,
} from '@phosphor-icons/react/ssr'
import { usePathname } from 'fumadocs-core/framework'
import Link from 'fumadocs-core/link'
import type * as PageTree from 'fumadocs-core/page-tree'
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSearch } from '../../search'
import type { BaseLayoutProps, MantineDocsSlots } from '../shared'
import classes from './docs-layout.module.css'

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root
  sidebar?: {
    enabled?: boolean
    collapsible?: boolean
    defaultOpened?: boolean
    banner?: ReactNode
    footer?: ReactNode
  }
  slots?: MantineDocsSlots
  containerProps?: ComponentProps<'div'>
}

interface LayoutContextValue {
  pages: PageTree.Item[]
  pathname: string
}

const DocsLayoutContext = createContext<LayoutContextValue | null>(null)

export function useDocsLayout() {
  const value = use(DocsLayoutContext)
  if (!value)
    throw new Error('Docs page components must be used inside <DocsLayout>.')
  return value
}

export function DocsLayout({
  tree,
  nav = {},
  sidebar = {},
  links = [],
  githubUrl,
  searchToggle = {},
  themeSwitch = {},
  slots,
  children,
  containerProps,
}: DocsLayoutProps) {
  const pathname = usePathname()
  const [mobileOpened, setMobileOpened] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [columnChanged, setColumnChanged] = useState(false)
  const hoverTimer = useRef(0)
  const pages = useMemo(() => flattenPages(tree.children), [tree])
  const sidebarEnabled = sidebar.enabled !== false
  const collapsible = sidebar.collapsible !== false
  const Sidebar = slots?.sidebar
  const title = nav.title ?? tree.name
  const renderNavigation = (onNavigate: () => void) =>
    Sidebar ? (
      <Sidebar />
    ) : (
      <Navigation
        tree={tree}
        links={links}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    )

  // Hover-to-peek behavior when the desktop sidebar is collapsed, ported
  // from upstream fumadocs-ui: a 16px strip at the browser's left edge (and
  // the floating sidebar itself) keeps the sidebar open while hovered.
  const onPeekEnter = (event: React.PointerEvent) => {
    if (!collapsed || event.pointerType === 'touch') return
    window.clearTimeout(hoverTimer.current)
    setHovered(true)
  }
  const onPeekLeave = (event: React.PointerEvent) => {
    if (!collapsed || event.pointerType === 'touch') return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(
      () => setHovered(false),
      // if the mouse is leaving the viewport, add a close delay
      Math.min(event.clientX, document.body.clientWidth - event.clientX) > 100
        ? 0
        : 500
    )
  }

  // Mirror upstream: only animate grid columns right after a collapse toggle
  const onCollapseToggle = (value: boolean | ((prev: boolean) => boolean)) => {
    setColumnChanged(true)
    setHovered(false)
    setCollapsed(value)
    window.setTimeout(() => setColumnChanged(false), 300)
  }

  return (
    <DocsLayoutContext value={{ pages, pathname }}>
      <div
        {...containerProps}
        className={[
          classes.layout,
          !sidebarEnabled && classes.layoutNoSidebar,
          containerProps?.className,
        ]
          .filter(Boolean)
          .join(' ')}
        data-sidebar-collapsed={
          sidebarEnabled && collapsible && collapsed ? 'true' : undefined
        }
        data-no-sidebar={!sidebarEnabled || undefined}
        data-column-changed={columnChanged || undefined}
      >
        {sidebarEnabled && (
          <>
            <aside
              className={classes.sidebar}
              data-collapsed={collapsed || undefined}
              data-hovered={(collapsed && hovered) || undefined}
              onPointerEnter={onPeekEnter}
              onPointerLeave={onPeekLeave}
            >
              <SidebarHeader
                title={title}
                href={nav.url ?? '/'}
                collapsible={collapsible}
                onCollapse={() => onCollapseToggle((value) => !value)}
              />
              {sidebar.banner}
              {searchToggle.enabled !== false && <SearchButton />}
              <ScrollArea
                className={classes.sidebarScroll}
                type="auto"
                offsetScrollbars="y"
              >
                {renderNavigation(() => undefined)}
              </ScrollArea>
              <SidebarFooter githubUrl={githubUrl} themeSwitch={themeSwitch}>
                {nav.children}
                {sidebar.footer}
              </SidebarFooter>
            </aside>
            {collapsible && collapsed && (
              <div
                className={classes.sidebarHoverStrip}
                onPointerEnter={onPeekEnter}
                onPointerLeave={onPeekLeave}
              />
            )}
            {collapsible && collapsed && (
              <div className={classes.sidebarPanel}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => onCollapseToggle(false)}
                  aria-label="Open sidebar"
                >
                  <SidebarSimpleIcon size={18} />
                </ActionIcon>
                <SearchIconButton />
              </div>
            )}
          </>
        )}

        {nav.enabled !== false && (
          <header className={classes.mobileHeader}>
            <Group h="100%" px="md" gap="sm" wrap="nowrap">
              <Link className={classes.brand} href={nav.url ?? '/'}>
                {title}
              </Link>
              <Group ml="auto" gap={4} wrap="nowrap">
                {searchToggle.enabled !== false && <SearchIconButton />}
                {sidebarEnabled && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setMobileOpened(true)}
                    aria-label="Open navigation"
                  >
                    <SidebarSimpleIcon size={18} />
                  </ActionIcon>
                )}
              </Group>
            </Group>
          </header>
        )}

        {sidebarEnabled && (
          <Drawer
            opened={mobileOpened}
            onClose={() => setMobileOpened(false)}
            position="right"
            size="min(85vw, 380px)"
            title={title}
            classNames={{
              body: classes.mobileDrawerBody,
              header: classes.mobileDrawerHeader,
            }}
          >
            {sidebar.banner}
            {searchToggle.enabled !== false && <SearchButton />}
            <ScrollArea className={classes.mobileNavigation} type="auto">
              {renderNavigation(() => setMobileOpened(false))}
            </ScrollArea>
            <SidebarFooter githubUrl={githubUrl} themeSwitch={themeSwitch}>
              {nav.children}
              {sidebar.footer}
            </SidebarFooter>
          </Drawer>
        )}

        <main className={classes.shellMain}>{children}</main>
      </div>
    </DocsLayoutContext>
  )
}

function SidebarHeader({
  title,
  href,
  collapsible,
  onCollapse,
}: {
  title: ReactNode
  href: string
  collapsible: boolean
  onCollapse: () => void
}) {
  return (
    <div className={classes.sidebarHeader}>
      <Link className={classes.brand} href={href}>
        {title}
      </Link>
      {collapsible && (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={onCollapse}
          aria-label="Toggle sidebar"
          className={classes.sidebarCollapse}
        >
          <SidebarSimpleIcon size={18} />
        </ActionIcon>
      )}
    </div>
  )
}

function Navigation({
  tree,
  links,
  pathname,
  onNavigate,
}: {
  tree: PageTree.Root
  links: NonNullable<BaseLayoutProps['links']>
  pathname: string
  onNavigate: () => void
}) {
  return (
    <Box className={classes.sidebarContent}>
      {links
        .filter((item) => item.on === 'menu' || item.on === 'all')
        .map((item) => (
          <NavLink
            key={item.url}
            component={Link}
            href={item.url}
            label={item.text}
            leftSection={
              item.icon ??
              (item.external ? <ArrowSquareOutIcon size={14} /> : undefined)
            }
            onClick={onNavigate}
            className={classes.navLink}
          />
        ))}
      <PageTreeNodes
        nodes={tree.children}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    </Box>
  )
}

function PageTreeNodes({
  nodes,
  pathname,
  onNavigate,
}: {
  nodes: PageTree.Node[]
  pathname: string
  onNavigate: () => void
}) {
  return nodes.map((node, index) => {
    if (node.type === 'separator') {
      return (
        <Text
          key={node.$id ?? index}
          className={classes.sidebarSeparator}
          size="sm"
          fw={500}
        >
          {node.name}
        </Text>
      )
    }
    if (node.type === 'folder') {
      const active = folderContains(node, pathname)
      const children = (
        <PageTreeNodes
          nodes={node.children}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      )
      const props = {
        label: node.name,
        leftSection: node.icon,
        defaultOpened: node.defaultOpen ?? active,
        active: node.index ? isActive(node.index.url, pathname) : false,
        className: classes.navLink,
        children,
      }

      if (node.index) {
        return (
          <NavLink
            key={node.$id ?? index}
            component={Link}
            href={node.index.url}
            onClick={onNavigate}
            {...props}
          />
        )
      }

      return <NavLink key={node.$id ?? index} {...props} />
    }
    return (
      <NavLink
        key={node.$id ?? node.url}
        component={Link}
        href={node.url}
        external={node.external}
        label={node.name}
        leftSection={
          node.icon ??
          (node.external ? <ArrowSquareOutIcon size={14} /> : undefined)
        }
        active={isActive(node.url, pathname)}
        onClick={onNavigate}
        className={classes.navLink}
      />
    )
  })
}

function SearchButton() {
  const search = useSearch()
  const [modKey, setModKey] = useState('⌘')
  useEffect(() => {
    if (!/mac|iphone|ipad/i.test(navigator.platform)) setModKey('Ctrl')
  }, [])
  if (!search.enabled) return null
  return (
    <Button
      onClick={search.open}
      variant="default"
      color="gray"
      size="sm"
      fullWidth
      justify="space-between"
      className={classes.searchButton}
      leftSection={<MagnifyingGlassIcon size={16} />}
      rightSection={
        <Group gap={4} wrap="nowrap">
          <Kbd size="xs">{modKey}</Kbd>
          <Kbd size="xs">K</Kbd>
        </Group>
      }
    >
      Search
    </Button>
  )
}

function SearchIconButton() {
  const search = useSearch()
  if (!search.enabled) return null
  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={search.open}
      aria-label="Search"
    >
      <MagnifyingGlassIcon size={16} />
    </ActionIcon>
  )
}

function SidebarFooter({
  githubUrl,
  themeSwitch,
  children,
}: {
  githubUrl?: string
  themeSwitch: { enabled?: boolean }
  children?: ReactNode
}) {
  const hasLinks = Boolean(githubUrl) || Boolean(children)
  const showThemeSwitch = themeSwitch.enabled !== false
  if (!hasLinks && !showThemeSwitch) return null
  return (
    <div className={classes.sidebarFooter}>
      <div className={classes.sidebarFooterBar}>
        {hasLinks && (
          <Group gap={2} wrap="nowrap">
            {githubUrl && (
              <Tooltip label="GitHub">
                <ActionIcon
                  component="a"
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="subtle"
                  color="gray"
                  aria-label="GitHub"
                >
                  <GithubLogoIcon size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {children}
          </Group>
        )}
        {showThemeSwitch && <ColorSchemeButton />}
      </div>
    </div>
  )
}

function ColorSchemeButton() {
  const { toggleColorScheme } = useMantineColorScheme()
  const scheme = useComputedColorScheme('light')
  return (
    <Tooltip label={`Use ${scheme === 'dark' ? 'light' : 'dark'} theme`}>
      <button
        type="button"
        className={classes.themeToggle}
        onClick={toggleColorScheme}
        aria-label="Toggle Theme"
      >
        {/*
          Both icons stay mounted with static data-scheme markers; CSS picks
          the active one from the data-mantine-color-scheme attribute on
          <html>, which ColorSchemeScript writes before hydration. Marking
          the active icon from useComputedColorScheme would hydrate with
          mismatched attributes whenever a scheme is stored in localStorage.
        */}
        <span className={classes.themeToggleIcon} data-scheme="light">
          <SunIcon size={16} />
        </span>
        <span className={classes.themeToggleIcon} data-scheme="dark">
          <MoonIcon size={16} />
        </span>
      </button>
    </Tooltip>
  )
}

function flattenPages(nodes: PageTree.Node[]): PageTree.Item[] {
  const pages: PageTree.Item[] = []
  for (const node of nodes) {
    if (node.type === 'page') pages.push(node)
    if (node.type === 'folder') {
      if (node.index) pages.push(node.index)
      pages.push(...flattenPages(node.children))
    }
  }
  return pages
}

function folderContains(folder: PageTree.Folder, pathname: string): boolean {
  return (
    Boolean(folder.index && isNestedActive(folder.index.url, pathname)) ||
    folder.children.some((node) =>
      node.type === 'folder'
        ? folderContains(node, pathname)
        : node.type === 'page' && isNestedActive(node.url, pathname)
    )
  )
}

// Sidebar items are highlighted only on an exact URL match, mirroring
// upstream fumadocs-ui (`isActive(url, pathname, false)`).
function isActive(url: string, pathname: string) {
  return pathname === url
}

// Nested matching is only used to decide whether a folder should open.
function isNestedActive(url: string, pathname: string) {
  return pathname === url || (url !== '/' && pathname.startsWith(`${url}/`))
}
