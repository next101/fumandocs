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
        lines: 33,
        statements: 33,
        branches: 33,
        functions: 29,
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
