import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    fileParallelism: false,
    globals: true,
    include: ['test/e2e/**/*.spec.ts'],
    setupFiles: ['./test/e2e/setup.ts'],
    env: {
      DATABASE_URL: 'postgresql://findafriend:findafriend@localhost:5433/findafriend?schema=test',
      NODE_ENV: 'test',
      JWT_SECRET: 'findafriend-secret',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
