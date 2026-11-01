'use client'

import {
  ActionIcon,
  Burger,
  Button,
  Container,
  Drawer,
  Stack,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { GithubLogoIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { LogoWithTitle } from '@/components/logo'
import { ColorSchemeToggle } from '@/components/theme-toggle'
import { navLinks, primaryLink } from '@/lib/modules'
import { repoUrl } from '@/lib/site'
import classes from './header.module.css'
import sharedClasses from './shared.module.css'

export function SiteHeader() {
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
              {navLinks.map((link) => (
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
            {repoUrl && (
              <Tooltip label="GitHub repository" position="bottom">
                <ActionIcon
                  component="a"
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="default"
                  size={36}
                  aria-label="GitHub repository"
                >
                  <GithubLogoIcon size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            <ColorSchemeToggle />
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
          {navLinks.map((link) => (
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
            href={primaryLink.href}
            onClick={drawerHandlers.close}
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
