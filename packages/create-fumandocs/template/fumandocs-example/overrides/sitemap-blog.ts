import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...getPosts().map((page) => ({
      url: `${siteUrl}${page.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
