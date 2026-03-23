// pages/blender/dashboard-page.js
// Blender dashboard — entry point after login.
// CX reps use this to search for policies and navigate to them.
//
// ⚠️  SKELETON — all selectors are TODO.
//     Ask the dev team to open Blender in a browser and share selector hints,
//     or set up a pairing session on staging.

const BasePage = require('../base-page');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // TODO: real selector for the policy search field
    // (might be a global search bar at the top, or a dedicated input on the dashboard)
    this.policySearchInput = page.locator('[data-testid="policy-search-input"]'); // TODO
    this.searchSubmitButton = page.locator('[data-testid="search-submit"]');       // TODO

    // TODO: selector for a search result row — used in navigateToPolicy
    this.searchResultRow = page.locator('[data-testid="policy-result-row"]');     // TODO
  }

  /**
   * Types a policy ID into the search field and submits.
   * @param {string} policyId e.g. "LCP-123-456-789"
   */
  async searchForPolicy(policyId) {
    // TODO: implement once selectors are confirmed
    await this.policySearchInput.fill(policyId);
    await this.searchSubmitButton.click();
  }

  /**
   * Searches for a policy and clicks the first result to open its detail page.
   * @param {string} policyId
   */
  async navigateToPolicy(policyId) {
    // TODO: implement once selectors are confirmed
    // May need to wait for search results to load before clicking
    await this.searchForPolicy(policyId);
    await this.searchResultRow.first().click();
    // TODO: confirm what URL pattern the policy page has so we can waitForURL
    // e.g. await this.page.waitForURL(`**/policies/${policyId}**`);
  }
}

module.exports = DashboardPage;
