'use client'

import {
  ActionIcon,
  Burger,
  Button,
  Container,
  Drawer,
  Stack,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { GithubLogoIcon, MoonIcon, SunIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { LogoWithTitle } from '@/components/logo'
import classes from './header.module.css'
import sharedClasses from './shared.module.css'

const mainLinks = [
  { href: '/docs', label: 'Get started' },
  { href: '/docs/components', label: 'Components' },
]

export function SiteHeader() {
  const { toggleColorScheme } = useMantineColorScheme()
  const [drawerOpened, drawerHandlers] = useDisclosure(false)

  return (
    <header className={classes.header}>
      <Container size={1440} h="100%">
        <div className={classes.headerMain}>
          <div className={classes.headerSection}>
            <Burger
              opened={drawerOpened}
              onClick={drawerHandlers.toggle}
              size={20}
              lineSize={2}
              className={classes.burger}
              aria-label="Toggle navigation"
            />
            <Link href="/" className={sharedClasses.logo} aria-label="Home">
              <LogoWithTitle />
            </Link>
            <nav className={classes.mainLinks}>
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={classes.mainLink}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={classes.headerControls}>
            <Tooltip label="GitHub repository" position="bottom">
              <ActionIcon
                component="a"
                href="https://github.com/next101/fumandocs"
                target="_blank"
                rel="noreferrer"
                variant="default"
                size={36}
                radius="md"
                aria-label="GitHub repository"
              >
                <GithubLogoIcon size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Toggle color scheme" position="bottom">
              <ActionIcon
                onClick={() => toggleColorScheme()}
                variant="default"
                size={36}
                radius="md"
                aria-label="Toggle color scheme"
              >
                {/*
                  Both icons stay mounted and CSS picks the visible one based
                  on the data-mantine-color-scheme attribute (set by
                  ColorSchemeScript before hydration). Rendering one icon from
                  useComputedColorScheme would mismatch: the provider reads
                  localStorage on the first client render while the server
                  always renders the default scheme.
                */}
                <SunIcon size={18} className={classes.sunIcon} />
                <MoonIcon size={18} className={classes.moonIcon} />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
      </Container>

      <Drawer
        opened={drawerOpened}
        onClose={drawerHandlers.close}
        size={300}
        padding="md"
        title={
          <Link
            href="/"
            className={sharedClasses.logo}
            onClick={drawerHandlers.close}
          >
            <LogoWithTitle />
          </Link>
        }
        zIndex={1000}
      >
        <Stack gap={4} mt="md">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classes.mainLink}
              onClick={drawerHandlers.close}
            >
              {link.label}
            </Link>
          ))}
          <Button
            component={Link}
            href="/docs"
            onClick={drawerHandlers.close}
            radius="md"
            mt="md"
            fullWidth
          >
            Get Started
          </Button>
        </Stack>
      </Drawer>
    </header>
  )
}
