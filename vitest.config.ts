import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('packages/create-fumandocs/src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportOnFailure: true,
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        '**/*.module.css',
        '**/index.ts',
        '**/index.tsx',
        // Type-only module: emits no runtime code to cover.
        'packages/fumandocs-ui/src/layouts/shared.ts',
      ],
      thresholds: {
        // Floor for the suite as a whole; raise as the gaps below get covered.
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80,
        // Pure helpers extracted for testing: keep them complete.
        'packages/fumandocs-ui/src/components/toc-geometry.ts': {
          lines: 100,
          statements: 100,
          branches: 100,
          functions: 100,
        },
        'packages/fumandocs-ui/src/layouts/docs/page-tree.ts': {
          lines: 100,
          statements: 100,
          branches: 100,
          functions: 100,
        },
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'create-fumandocs',
          environment: 'node',
          include: ['packages/create-fumandocs/src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'fumandocs-ui',
          environment: 'jsdom',
          // React's production build drops `act`, which breaks testing-library.
          env: { NODE_ENV: 'test' },
          include: ['packages/fumandocs-ui/src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
})
