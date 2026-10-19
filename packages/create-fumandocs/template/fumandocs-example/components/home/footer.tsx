'use client'

import { Button, Container, Group, Text } from '@mantine/core'
import { useWindowEvent } from '@mantine/hooks'
import { GithubLogoIcon, PackageIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useRef } from 'react'
import { LogoWithTitle } from '@/components/logo'
import classes from './footer.module.css'
import sharedClasses from './shared.module.css'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Docs',
    links: [
      { label: 'Getting started', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
    ],
  },
  {
    title: 'Ecosystem',
    links: [
      { label: 'Fumadocs', href: 'https://fumadocs.dev', external: true },
      { label: 'Mantine', href: 'https://mantine.dev', external: true },
      {
        label: 'npm',
        href: 'https://www.npmjs.com/package/fumandocs-ui',
        external: true,
      },
    ],
  },
  {
    title: 'Community',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/next101/fumandocs',
        external: true,
      },
      {
        label: 'Issues',
        href: 'https://github.com/next101/fumandocs/issues',
        external: true,
      },
      {
        label: 'Releases',
        href: 'https://github.com/next101/fumandocs/releases',
        external: true,
      },
    ],
  },
]

function LinksGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className={classes.group}>
      <Text className={classes.groupTitle}>{title}</Text>
      {links.map((link) =>
        link.external ? (
          <Text
            key={link.href}
            component="a"
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={classes.link}
          >
            {link.label}
          </Text>
        ) : (
          <Text
            key={link.href}
            component={Link}
            href={link.href}
            className={classes.link}
          >
            {link.label}
          </Text>
        )
      )}
    </div>
  )
}

function getRemainingScrollDistance() {
  const scrollTop = document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  return documentHeight - (scrollTop + viewportHeight)
}

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)

  useWindowEvent('scroll', () => {
    const diff = getRemainingScrollDistance() - 30
    if (ref.current) {
      const translate = diff > 0 ? diff / 2 : 0
      ref.current.style.transform = `translateY(${translate}px)`
    }
  })

  return (
    <div className={classes.root}>
      <div className={classes.spacer} />
      <footer className={classes.wrapper} ref={ref}>
        <Container size={1440}>
          <div className={classes.inner}>
            <div className={classes.logoSection}>
              <Link href="/" className={sharedClasses.logo}>
                <LogoWithTitle />
              </Link>
              <Text className={classes.description} fz="sm">
                The Fumadocs content engine with Mantine as the UI layer
              </Text>
            </div>

            <div className={classes.groups}>
              {groups.map((group) => (
                <LinksGroup
                  key={group.title}
                  title={group.title}
                  links={group.links}
                />
              ))}
            </div>
          </div>

          <div className={classes.after}>
            <Group justify="space-between" wrap="wrap">
              <Text fz="xs" className={classes.afterNote}>
                Scaffolded with{' '}
                <a href="https://github.com/next101/fumandocs">
                  create-fumandocs
                </a>{' '}
                · Built with <a href="https://fumadocs.dev">Fumadocs</a> and{' '}
                <a href="https://mantine.dev">Mantine</a>
              </Text>
              <div className={classes.social}>
                <Button
                  component="a"
                  href="https://github.com/next101/fumandocs"
                  target="_blank"
                  rel="noreferrer"
                  radius="md"
                  leftSection={<GithubLogoIcon size={16} />}
                  className={`${classes.socialBtn} ${classes.githubBtn}`}
                >
                  Star on GitHub
                </Button>
                <Button
                  component="a"
                  href="https://www.npmjs.com/package/fumandocs-ui"
                  target="_blank"
                  rel="noreferrer"
                  radius="md"
                  leftSection={<PackageIcon size={16} />}
                  className={`${classes.socialBtn} ${classes.npmBtn}`}
                >
                  fumandocs-ui
                </Button>
              </div>
            </Group>
          </div>
        </Container>
      </footer>
    </div>
  )
}
