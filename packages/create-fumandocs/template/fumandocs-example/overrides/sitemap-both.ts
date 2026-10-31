import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'
import { source } from '@/lib/source'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...source.getPages().map((page) => ({
      url: `${siteUrl}${page.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...getPosts().map((page) => ({
      url: `${siteUrl}${page.url}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
