// pages/blender/policy/payments-tab.js
// Payments tab on the Blender policy detail page.
// This is where the "PAYMENT ACTIONS" button and Change Payment Plan flow live.
//
// ⚠️  SKELETON — all selectors are TODO.
//     These need to be filled in after confirming with dev/design what
//     the actual component structure looks like in staging.
//     Don't guess class names — use data-testid or roles.

const BasePage = require('../../base-page');

class PaymentsTab extends BasePage {
  constructor(page) {
    super(page);

    // ── Payment Actions button ────────────────────────────────────────────────
    // This button opens a dropdown/menu with payment-related actions.
    // TODO: confirm the exact testid or role+name with frontend dev
    this.paymentActionsButton = page.locator('[data-testid="payment-actions-button"]'); // TODO
    // Alternative if no testid: page.getByRole('button', { name: /payment actions/i })

    // ── Dropdown menu items ───────────────────────────────────────────────────
    // After clicking PAYMENT ACTIONS, a menu appears with options.
    // TODO: confirm selectors for menu items
    this.changePaymentPlanOption = page.locator('[data-testid="change-payment-plan-option"]'); // TODO
    // Alternative: page.getByRole('menuitem', { name: /change payment plan/i })

    // ── Change Payment Plan dialog ────────────────────────────────────────────
    // TODO: confirm dialog selectors with dev
    this.changePaymentPlanDialog  = page.locator('[data-testid="change-payment-plan-dialog"]'); // TODO
    this.dialogTitle              = page.locator('[data-testid="dialog-title"]');               // TODO
    this.dialogFromPlan           = page.locator('[data-testid="dialog-from-plan"]');           // TODO
    this.dialogToPlan             = page.locator('[data-testid="dialog-to-plan"]');             // TODO
    this.dialogWhatWillHappen     = page.locator('[data-testid="dialog-what-will-happen"]');    // TODO
    this.dialogFinancialMessage   = page.locator('[data-testid="dialog-financial-message"]');   // TODO
    this.dialogDisclaimer         = page.locator('[data-testid="dialog-disclaimer"]');          // TODO
    this.dialogCancelButton       = page.locator('[data-testid="dialog-cancel-button"]');       // TODO
    this.dialogChangeButton       = page.locator('[data-testid="dialog-change-button"]');       // TODO
  }

  async clickPaymentActionsButton() {
    // TODO: implement after confirming selector
    await this.paymentActionsButton.click();
  }

  async clickChangePaymentPlan() {
    // TODO: implement after confirming selector
    // Note: menu must already be open before calling this
    await this.changePaymentPlanOption.click();
  }

  /**
   * Returns true if the "Change payment plan" menu option is disabled.
   * Expected on cancelled policies.
   */
  async isChangePaymentPlanDisabled() {
    // TODO: confirm how "disabled" is represented — aria-disabled? a CSS class?
    // Most likely: await this.changePaymentPlanOption.getAttribute('aria-disabled')
    const ariaDisabled = await this.changePaymentPlanOption.getAttribute('aria-disabled'); // TODO
    return ariaDisabled === 'true';
  }

  /**
   * Returns the text content of the PAYMENT ACTIONS button.
   * Used to verify the button label is correct.
   */
  async getPaymentActionsButtonText() {
    // TODO: implement after confirming selector
    return this.paymentActionsButton.textContent();
  }
}

module.exports = PaymentsTab;
