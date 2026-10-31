import type { ReactNode } from 'react'
import { BlogFooter } from './blog-footer'
import { BlogHeader } from './blog-header'
import classes from './blog-shell.module.css'

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className={classes.root}>
      <BlogHeader />
      <main className={classes.main}>{children}</main>
      <BlogFooter />
    </div>
  )
}
