// helpers/auth.js
// Handles authentication for Blender (backoffice).
//
// TODO: Confirm auth method with the dev team before implementing.
//       Blender might use SSO (Okta / Google Workspace) — if it does,
//       the simple username+password login below won't work and we'll need
//       a different approach (e.g. mock the SSO token, use a service account,
//       or spin up a browser session manually with the identity provider).

const { chromium } = require('@playwright/test');
const path = require('path');
const environments = require('../config/environments');

const AUTH_STATE_PATH = path.join(__dirname, '../fixtures/auth-state.json');

/**
 * Logs in to Blender using credentials from .env and saves session state.
 * Call this once before running the Blender test suite so tests can reuse
 * the session instead of logging in on every test.
 *
 * Run with: npm run setup:auth
 */
async function saveAuthState(browser) {
  // TODO: replace this with the real Blender login flow once we have staging access
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(environments.blender_staging.baseURL + '/login');

  // TODO: fill in real selectors after confirming with dev
  // await page.fill('[data-testid="email-input"]', process.env.BLENDER_USERNAME);
  // await page.fill('[data-testid="password-input"]', process.env.BLENDER_PASSWORD);
  // await page.click('[data-testid="login-button"]');
  // await page.waitForURL('**/dashboard');

  await context.storageState({ path: AUTH_STATE_PATH });
  await context.close();

  console.log('Auth state saved to', AUTH_STATE_PATH);
}

/**
 * Returns the path to the saved auth state file.
 * Pass this to browser.newContext({ storageState: loadAuthState() })
 */
function loadAuthState() {
  return AUTH_STATE_PATH;
}

/**
 * Convenience: navigate to Blender and restore session from saved state.
 * Use this in beforeEach hooks for Blender tests.
 */
async function loginToBlender(page) {
  // TODO: implement after staging access is confirmed
  // For now this is a placeholder so imports don't break.
  // If SSO is in play, update this to use the appropriate auth flow.
  throw new Error(
    'loginToBlender() is not implemented yet — waiting for staging access. ' +
      'See helpers/auth.js for details.'
  );
}

module.exports = { saveAuthState, loadAuthState, loginToBlender };

// Allow running directly: node helpers/auth.js
if (require.main === module) {
  (async () => {
    const browser = await chromium.launch();
    await saveAuthState(browser);
    await browser.close();
  })();
}
