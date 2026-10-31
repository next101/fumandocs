import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultLanguage: 'ts',
    },
  },
})

export default withMDX({ reactStrictMode: true })
