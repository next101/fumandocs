import { Container } from '@mantine/core'
import Link from 'next/link'
import { LogoWithTitle } from '@/components/logo'
import { ColorSchemeToggle } from '@/components/theme-toggle'
import { navLinks } from '@/lib/modules'
import classes from './blog-header.module.css'

export function BlogHeader() {
  return (
    <header className={classes.header}>
      <Container size={760} className={classes.inner}>
        <Link href="/" className={classes.brand} aria-label="Home">
          <LogoWithTitle size={22} />
        </Link>
        <nav className={classes.nav} aria-label="Site">
          {navLinks
            .filter((link) => link.href !== '/blog')
            .map((link) => (
              <Link key={link.href} href={link.href} className={classes.link}>
                {link.label}
              </Link>
            ))}
          <ColorSchemeToggle />
        </nav>
      </Container>
    </header>
  )
}
