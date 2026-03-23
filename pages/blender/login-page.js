// pages/blender/login-page.js
// Blender login page object.
//
// ⚠️  SKELETON — all selectors are TODO.
//     Before filling these in:
//       1. Get staging URL from dev / infra team
//       2. Confirm auth mechanism (username+password vs SSO / Okta / Google)
//       3. If SSO: ask dev whether there's a test-only bypass or a service account
//       4. Fill in the actual selectors after opening the page in a browser

const BasePage = require('../base-page');
const environments = require('../../config/environments');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // TODO: replace placeholder selectors with real ones after staging access
    // Preferred: data-testid. Fallback: getByRole / getByLabel.
    this.emailInput    = page.locator('[data-testid="email-input"]');       // TODO
    this.passwordInput = page.locator('[data-testid="password-input"]');    // TODO
    this.loginButton   = page.locator('[data-testid="login-button"]');      // TODO
    this.errorMessage  = page.locator('[data-testid="login-error"]');       // TODO
  }

  async goto() {
    await this.page.goto(environments.blender_staging.baseURL + '/login');
    await this.waitForLoad();
  }

  async fillEmail(email) {
    // TODO: implement after confirming selector
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    // TODO: implement after confirming selector
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    // TODO: implement after confirming selector
    await this.loginButton.click();
  }

  async waitForDashboard() {
    // TODO: update the URL pattern to match what Blender actually redirects to after login
    await this.page.waitForURL('**/dashboard', { timeout: 15_000 });
  }

  /** Full login sequence — use this in beforeAll/setup hooks. */
  async login(email, password) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.waitForDashboard();
  }
}

module.exports = LoginPage;
