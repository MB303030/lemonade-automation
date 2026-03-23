// pages/blender/policy/policy-page.js
// Top-level policy detail page in Blender.
// Contains tab navigation (Payments, Timeline, etc.) and policy header info.
//
// ⚠️  SKELETON — all selectors are TODO.
//     Before implementing: open a real policy on Blender staging and
//     share the HTML with the QA team so selectors can be confirmed.

const BasePage = require('../../base-page');

class PolicyPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Tabs ─────────────────────────────────────────────────────────────────
    // TODO: real selectors for tab navigation.
    // Could be <a> tags, <button> tags, or custom components — confirm with dev.
    this.paymentsTabButton  = page.locator('[data-testid="tab-payments"]');   // TODO
    this.timelineTabButton  = page.locator('[data-testid="tab-timeline"]');   // TODO

    // ── Policy header ─────────────────────────────────────────────────────────
    // TODO: selectors for the policy ID and status badge shown in the page header
    this.policyIdDisplay    = page.locator('[data-testid="policy-id"]');      // TODO
    this.policyStatusBadge  = page.locator('[data-testid="policy-status"]');  // TODO
  }

  async goToPaymentsTab() {
    // TODO: implement after confirming selector
    await this.paymentsTabButton.click();
    // TODO: wait for the payments tab content to be visible
    // e.g. await page.locator('[data-testid="payments-tab-content"]').waitFor();
  }

  async goToTimelineTab() {
    // TODO: implement after confirming selector
    await this.timelineTabButton.click();
    // TODO: wait for timeline content to be visible
  }

  /** Returns the policy status text from the header badge (e.g. "Active", "Cancelled"). */
  async getPolicyStatus() {
    // TODO: implement after confirming selector
    return this.policyStatusBadge.textContent();
  }

  /** Returns the policy ID shown in the page header. */
  async getPolicyId() {
    // TODO: implement after confirming selector
    return this.policyIdDisplay.textContent();
  }
}

module.exports = PolicyPage;
