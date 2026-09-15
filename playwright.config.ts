import { defineConfig } from '@playwright/test'
import { normalizeBaseURL } from './scripts/pwa-config.mjs'

const baseURL = normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')
const serverURL = `http://127.0.0.1:4173${baseURL}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: serverURL,
    serviceWorkers: 'allow',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: serverURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
