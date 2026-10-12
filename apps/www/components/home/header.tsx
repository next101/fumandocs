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
  Burger,
  Button,
  Container,
  Drawer,
  Stack,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { GithubLogoIcon, MoonIcon, SunIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { LogoWithTitle } from '../logo'
import classes from './header.module.css'
import sharedClasses from './shared.module.css'

const mainLinks = [
  { href: '/docs/getting-started', label: 'Get started' },
  { href: '/docs/guides/theming', label: 'Theming' },
]

export function SiteHeader() {
  const { toggleColorScheme } = useMantineColorScheme()
  const colorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  })
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
            <Link
              href="/"
              className={sharedClasses.logo}
              aria-label="Fumandocs home"
            >
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
                {colorScheme === 'dark' ? (
                  <SunIcon size={18} />
                ) : (
                  <MoonIcon size={18} />
                )}
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
            href="/docs/getting-started"
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
