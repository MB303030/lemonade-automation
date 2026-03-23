// pages/blender/policy/timeline-tab.js
// Timeline tab on the Blender policy detail page.
// Shows a chronological list of policy events (payment plan changes, endorsements, etc.)
//
// ⚠️  SKELETON — all selectors are TODO.
//     Ask dev what the event list structure looks like:
//     - Is it a <ul>/<li> list? A table? A custom component?
//     - How are individual events identified?
//     - Is there a detail panel / modal that opens on click?

const BasePage = require('../../base-page');

class TimelineTab extends BasePage {
  constructor(page) {
    super(page);

    // ── Event list ────────────────────────────────────────────────────────────
    // The most recent event should be at the top (confirm ordering with dev)
    // TODO: confirm the selector for the timeline event container/list
    this.eventList       = page.locator('[data-testid="timeline-event-list"]');      // TODO
    this.latestEventItem = page.locator('[data-testid="timeline-event-item"]').first(); // TODO

    // Within the latest event item:
    // TODO: confirm child selectors for title and time
    this.latestEventTitle = this.latestEventItem.locator('[data-testid="event-title"]'); // TODO
    this.latestEventTime  = this.latestEventItem.locator('[data-testid="event-time"]');  // TODO

    // ── Event details panel/modal ─────────────────────────────────────────────
    // After clicking an event, a details view opens showing:
    // policy ID, amount, performed-by user
    // TODO: confirm whether this is a side panel, modal, or expanded inline row
    this.eventDetailsPanel       = page.locator('[data-testid="event-details-panel"]');      // TODO
    this.detailsPolicyId         = page.locator('[data-testid="details-policy-id"]');         // TODO
    this.detailsAmount           = page.locator('[data-testid="details-amount"]');            // TODO
    this.detailsPerformedBy      = page.locator('[data-testid="details-performed-by"]');      // TODO
    this.detailsCloseButton      = page.locator('[data-testid="details-close-button"]');      // TODO
  }

  /**
   * Returns the title text of the most recent timeline event.
   * e.g. "Switched to Semi-Annual Payments"
   */
  async getLatestEventTitle() {
    // TODO: implement after confirming selector
    return this.latestEventTitle.textContent();
  }

  /**
   * Returns the timestamp text of the most recent timeline event.
   */
  async getLatestEventTime() {
    // TODO: implement after confirming selector
    return this.latestEventTime.textContent();
  }

  /**
   * Opens the detail view for the most recent timeline event.
   */
  async openLatestEventDetails() {
    // TODO: implement — might be a click on the row, or a dedicated "Details" button
    await this.latestEventItem.click();
    // TODO: wait for the details panel to appear
    // await this.eventDetailsPanel.waitFor({ state: 'visible' });
  }

  /**
   * Returns the policy ID shown in the event details panel.
   */
  async getDetailsPolicyId() {
    // TODO: implement after confirming selector
    return this.detailsPolicyId.textContent();
  }

  /**
   * Returns the amount shown in the event details panel.
   */
  async getDetailsAmount() {
    // TODO: implement after confirming selector
    return this.detailsAmount.textContent();
  }

  /**
   * Returns the "performed by" user shown in the event details panel.
   */
  async getDetailsPerformedBy() {
    // TODO: implement after confirming selector
    return this.detailsPerformedBy.textContent();
  }
}

module.exports = TimelineTab;
