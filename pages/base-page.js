// pages/base-page.js
// All page objects extend this. Common navigation and utility methods live here
// so we don't repeat them in every page class.

class BasePage {
  constructor(page) {
    this.page = page;

    // Cookie consent dialog — appears on first load.
    // Heading: "lemonade and cookies"
    this.cookieDialog        = page.getByRole('dialog');
    this.cookieAcceptButton  = page.getByRole('button', { name: 'Accept all', exact: true });
    this.cookieRejectButton  = page.getByRole('button', { name: 'Reject all', exact: true });
  }

  async goto(path = '/') {
    // Use domcontentloaded so navigation resolves even during a Cloudflare challenge.
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    // Wait for any Cloudflare "Just a moment…" challenge to clear.
    // The challenge runs JS in the browser automatically — we just have to wait.
    // We catch the error here so tests don't fail on timeout; they proceed and
    // the test body assertions will fail with a meaningful message instead.
    const title = await this.page.title();
    if (title.toLowerCase().includes('just a moment')) {
      try {
        await this.page.waitForFunction(
          () => !document.title.toLowerCase().includes('just a moment'),
          { timeout: 90_000 }
        );
        // Once the challenge clears, give the SPA a moment to hydrate
        await this.page.waitForLoadState('domcontentloaded');
      } catch {
        // Challenge did not clear in 90s — likely a flagged IP. Tests will fail
        // with element-not-found errors which is the expected signal.
      }
    }
    await this.dismissCookieBanner();
  }

  /**
   * Dismisses the "lemonade and cookies" consent dialog if it's present.
   * Safe to call even when the dialog isn't showing — it will no-op in that case.
   * We click "Reject all" to keep test behaviour consistent (no tracking side effects).
   */
  async dismissCookieBanner() {
    try {
      await this.cookieRejectButton.click({ timeout: 4_000 });
      // Wait for the dialog to disappear
      await this.cookieDialog.waitFor({ state: 'hidden', timeout: 3_000 });
    } catch {
      // Dialog didn't appear or already dismissed — that's fine
    }
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Returns how long the page took to reach DOMContentLoaded in ms.
   * Rough proxy for page load performance — not a substitute for real perf tooling.
   */
  async measureLoadTime() {
    const timing = await this.page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return nav ? nav.domContentLoadedEventEnd - nav.startTime : null;
    });
    return timing;
  }
}

module.exports = BasePage;
