/**
 * Public site URL, used by robots.ts and sitemap.ts.
 * Set NEXT_PUBLIC_SITE_URL in production, e.g. https://docs.example.com.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')

/** Site description, replaced at scaffold time by create-fumandocs. */
export const siteDescription = '__SITE_DESCRIPTION__'

/**
 * The project repository, used by the header, hero, and footer links.
 * Set NEXT_PUBLIC_REPO_URL, or leave it empty to hide those links.
 */
export const repoUrl = (process.env.NEXT_PUBLIC_REPO_URL ?? '').replace(
  /\/$/,
  ''
)
