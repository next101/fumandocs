/**
 * Public site URL, used by robots.ts and sitemap.ts.
 * Set NEXT_PUBLIC_SITE_URL in production, e.g. https://docs.example.com.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '')
