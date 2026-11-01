import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/home/footer'
import { SiteHeader } from '@/components/home/header'
import classes from './blog-shell.module.css'

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className={classes.root}>
      <SiteHeader />
      <main className={classes.main}>{children}</main>
      <SiteFooter />
    </div>
  )
}
