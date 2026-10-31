/**
 * Navigation entries for the modules enabled when the site was scaffolded.
 * `create-fumandocs` strips the entries for modules that were not selected.
 */
export const navLinks = [
  // @modules docs
  { href: '/docs', label: 'Docs' },
  // @modules-end
  // @modules blog
  { href: '/blog', label: 'Blog' },
  // @modules-end
]

/** First enabled module, used for primary calls to action. */
export const primaryLink = navLinks[0]
