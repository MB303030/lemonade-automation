// pages/website/get-quote-page.js
// Entry point for the Lemonade quote/onboarding flow.
//
// The flow at /start/1 is a conversational chat interface ("Maya") that
// collects the user's name first, then guides them through product selection
// and coverage details in a step-by-step conversation. There is no traditional
// product-picker landing screen — the onboarding starts immediately with a
// personal greeting form.
//
// Observed first step (from real browser):
//   Heading: "I'll get you an awesome price in minutes. Ready to go?"
//   Inputs:  "First name", "Last name"
//   Button:  "Let's do this" (disabled until both fields are filled)
//
// The /onboarding/start URL lands on a contact/help form, not the quote flow.
// Use /start/1 for the quote flow.

const BasePage = require('../base-page');

class GetQuotePage extends BasePage {
  constructor(page) {
    super(page);

    // ── First step: name collection ──────────────────────────────────────────
    // The chat UI opens with Maya asking for name.
    this.firstStepHeading = page.getByRole('heading', {
      name: /get you an awesome price in minutes/i,
    });

    this.firstNameInput = page.getByRole('textbox', { name: /first name/i });
    this.lastNameInput  = page.getByRole('textbox', { name: /last name/i });

    // "Let's do this" is disabled until both name fields are filled
    this.letsDoThisButton = page.getByRole('button', { name: /let.?s do this/i });

    // ── Navigation controls ───────────────────────────────────────────────────
    // "Start Over" link exists in the nav within the onboarding flow
    this.startOverLink = page.getByRole('link', { name: /start over/i });

    // ── Generic continue / next (appears in later steps) ─────────────────────
    this.continueButton = page.getByRole('button', { name: /continue|next|let.?s do this/i }).first();
  }

  /**
   * Navigate to the quote flow start.
   * The cookie banner is dismissed automatically by BasePage.goto().
   */
  async goto() {
    await super.goto('/start/1');
  }

  /**
   * Navigate directly to quote start pre-selecting a product.
   * URL pattern observed: /onboarding/start?p=home_us_renters
   * @param {'renters'|'homeowners'|'car'|'pet'|'life'} product
   */
  async gotoProduct(product) {
    const productParam = {
      renters:    'home_us_renters',
      homeowners: 'home_us_owners',
      car:        'car',
      pet:        'pet',
      life:       'life',
    };
    const param = productParam[product.toLowerCase()];
    if (!param) throw new Error(`Unknown product: "${product}"`);
    await super.goto(`/onboarding/start?p=${param}`);
  }

  /**
   * Fills the first name field.
   * Uses pressSequentially to reliably trigger React's onChange handler.
   */
  async enterFirstName(name) {
    await this.firstNameInput.click();
    await this.firstNameInput.pressSequentially(name, { delay: 50 });
  }

  /**
   * Fills the last name field.
   * Uses pressSequentially to reliably trigger React's onChange handler.
   */
  async enterLastName(name) {
    await this.lastNameInput.click();
    await this.lastNameInput.pressSequentially(name, { delay: 50 });
  }

  /**
   * Clicks the "Let's do this" button to advance the flow.
   * Both name fields must be filled first or the button stays disabled.
   */
  async clickLetsDoThis() {
    await this.letsDoThisButton.click();
  }

  /**
   * Returns true if the first step of the quote form has loaded.
   * We check for the presence of the name input fields.
   */
  async isLoaded() {
    try {
      await this.firstNameInput.waitFor({ state: 'visible', timeout: 12_000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = GetQuotePage;
