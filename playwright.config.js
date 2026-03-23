// @ts-check
require('dotenv').config();

const { defineConfig, devices } = require('@playwright/test');
const environments = require('./config/environments');
const fs   = require('fs');
const path = require('path');

// Only reuse the saved session if global-setup confirmed the Cloudflare challenge cleared.
// If the flag file is missing (setup failed or wasn't run), tests start with a fresh context
// and rely on retries to ride out the Cloudflare warmup.
const STATE_PATH        = path.join(__dirname, 'fixtures', 'website-storage-state.json');
const STATE_CLEARED_FLAG = STATE_PATH + '.ok';
const websiteStorageState =
  fs.existsSync(STATE_CLEARED_FLAG) && fs.existsSync(STATE_PATH) ? STATE_PATH : undefined;

module.exports = defineConfig({
  testDir: './tests',
  // 120s timeout — lemonade.com uses Cloudflare bot protection. First few test
  // navigations may hit a "Just a moment…" challenge that takes up to 90s to
  // self-resolve once the browser runs Cloudflare's JS. After the first clear,
  // subsequent tests are fast. With retries:2, the total budget per test is
  // 3 × 120s which is enough to ride out a warmup + pass on retry.
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  // Run tests sequentially (1 worker) to avoid Cloudflare bot-detection
  // triggering when too many parallel requests hit lemonade.com.
  // On CI you can override with --workers if you have a way to rotate IPs.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  // 2 retries — lemonade.com uses Cloudflare bot protection. The first attempt
  // sometimes lands on a challenge page ("Just a moment…") which blocks the test.
  // The challenge resolves within ~60s, and the retry then succeeds. 2 retries
  // handles the warmup gracefully without needing extra infrastructure.
  retries: 2,
  workers: 1,

  // The global setup navigates to lemonade.com to warm up the Cloudflare session.
  // It saves browser storage state so subsequent test contexts can reuse it.
  // If the challenge doesn't clear in time, the setup warns and tests fall back to retries.
  globalSetup: './global-setup.js',

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: environments.website.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-failure',
    // Use the pre-cleared Cloudflare session if global setup succeeded.
    // Falls back to undefined (fresh context + retries) if it didn't.
    ...(websiteStorageState ? { storageState: websiteStorageState } : {}),
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // closest to iPhone 12 viewport in Playwright's device list
    },
  ],
});
