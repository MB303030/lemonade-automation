// global-setup.js
// Runs once before the entire test suite.
//
// Navigates to lemonade.com and waits for any Cloudflare bot challenge to
// self-resolve, then saves the browser session (cookies/localStorage) so that
// all tests can reuse it and skip the per-test challenge overhead.
//
// Why this matters: Cloudflare's "Just a moment…" challenge triggers on new
// browser sessions from automation IPs. The challenge resolves automatically
// once the browser runs the challenge JS — but it can take up to 3-4 minutes.
// Without this warmup, the first few tests hit the challenge and fail. With it,
// all tests start with a pre-cleared session.
//
// If the challenge never clears (very aggressive IP block), the tests fall back
// to the retry mechanism defined in playwright.config.js.

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const STATE_PATH        = path.join(__dirname, 'fixtures', 'website-storage-state.json');
const STATE_CLEARED_FLAG = STATE_PATH + '.ok';  // marker file — exists only if challenge cleared

module.exports = async (config) => {
  // Skip the warmup if only running Blender tests (all skipped anyway, no website URLs needed)
  const testDirs = process.argv.join(' ');
  if (testDirs.includes('blender') && !testDirs.includes('website')) {
    console.log('[global-setup] Blender-only run — skipping website warmup.');
    return;
  }

  // Allow skipping via env var (useful for quick local runs after IP is already cleared)
  if (process.env.SKIP_GLOBAL_SETUP === 'true') {
    console.log('[global-setup] SKIP_GLOBAL_SETUP=true — skipping warmup.');
    return;
  }

  // Clean up any stale flag from a previous run
  if (fs.existsSync(STATE_CLEARED_FLAG)) {
    fs.unlinkSync(STATE_CLEARED_FLAG);
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page    = await context.newPage();

  console.log('[global-setup] Navigating to lemonade.com…');
  try {
    await page.goto('https://www.lemonade.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
  } catch (e) {
    console.warn('[global-setup] Initial navigation timed out:', e.message);
    await browser.close();
    return;
  }

  // Wait up to 5 minutes for the Cloudflare challenge to clear.
  // Cloudflare's JS challenge runs in the browser and typically resolves within
  // 1-4 minutes when the IP is flagged. We can't speed this up — just wait.
  let challengeCleared = false;
  const title = await page.title();

  if (!title.toLowerCase().includes('just a moment')) {
    console.log('[global-setup] No Cloudflare challenge detected. Proceeding.');
    challengeCleared = true;
  } else {
    console.log('[global-setup] Cloudflare challenge detected. Waiting up to 5 minutes for it to clear…');
    try {
      await page.waitForFunction(
        () => !document.title.toLowerCase().includes('just a moment'),
        { timeout: 300_000 }  // 5 minutes
      );
      challengeCleared = true;
      console.log('[global-setup] Cloudflare challenge cleared ✓');
    } catch {
      console.warn(
        '[global-setup] Cloudflare challenge did not clear within 5 minutes.\n' +
        '  Tests will rely on per-test retries (slower but functional).\n' +
        '  For reliable runs: use a residential IP or configure playwright-extra stealth plugin.'
      );
    }
  }

  if (challengeCleared) {
    // Dismiss cookie consent banner before saving state
    try {
      await page.getByRole('button', { name: 'Reject all', exact: true }).click({ timeout: 5_000 });
      await page.getByRole('dialog').waitFor({ state: 'hidden', timeout: 3_000 });
    } catch { /* banner may not have appeared */ }

    const fixturesDir = path.dirname(STATE_PATH);
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    await context.storageState({ path: STATE_PATH });
    // Write a marker so playwright.config.js knows this state is valid
    fs.writeFileSync(STATE_CLEARED_FLAG, new Date().toISOString());
    console.log('[global-setup] Session state saved to', STATE_PATH);
  }

  await browser.close();
};
