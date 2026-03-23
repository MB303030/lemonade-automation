// pages/website/homepage.js
// Selectors are based on what is actually visible at https://www.lemonade.com
// as of the time this project was created. Lemonade is a React SPA, so
// we rely on roles and visible text rather than CSS class names.

const BasePage = require('../base-page');

// Real nav items observed on lemonade.com
const NAV_LINKS = ['Renters', 'Homeowners', 'Car', 'Pet', 'Life', 'Giveback'];

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // ── Navigation ──────────────────────────────────────────────────────────
    // The main nav lives inside the page <header> (banner landmark).
    // Scoping to the banner avoids matching footer links with the same text.
    // Note: the Car link's accessible name is "NEW Car" (has a "NEW" badge in the DOM),
    // so we match with a partial regex rather than exact text.
    this.nav = page.getByRole('banner');
    this.logo = page.locator('a[href="/"], a[href="/?f=1"]').first();

    this.navRenters    = this.nav.getByRole('link', { name: 'Renters',    exact: true });
    this.navHomeowners = this.nav.getByRole('link', { name: 'Homeowners', exact: true });
    this.navCar        = this.nav.getByRole('link', { name: /^(NEW\s+)?Car$/i });
    this.navPet        = this.nav.getByRole('link', { name: 'Pet',        exact: true });
    this.navLife       = this.nav.getByRole('link', { name: 'Life',       exact: true });
    this.navGiveback   = this.nav.getByRole('link', { name: 'Giveback',   exact: true });
    this.navMyAccount  = this.nav.getByRole('link', { name: 'My Account', exact: true });

    // ── Hero ─────────────────────────────────────────────────────────────────
    // Heading observed on site: "Forget everything you know about insurance"
    this.heroHeading = page.getByRole('heading', {
      name: /forget everything you know about insurance/i,
    });

    // Subheading: "Instant everything. Incredible prices. Big heart."
    // Use the full sentence so we match only the <p> and not the <h2> "Instant everything"
    // that also exists in the products section lower on the page.
    this.heroSubheading = page.getByText('Instant everything. Incredible prices. Big heart.', { exact: true });

    // Main hero CTA — Lemonade renders several "check our prices" links on the page
    // (one per product card). The primary hero button has id="gtm_button_main_check_prices"
    // and data-position="top". Using the ID is the most stable single-element selector here.
    this.heroCtaButton = page.locator('#gtm_button_main_check_prices');
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  async getTitle() {
    return this.page.title();
  }

  /**
   * Clicks the primary hero CTA ("Check our Prices").
   * The button navigates to the onboarding/quote start page.
   */
  async clickGetQuote() {
    await this.heroCtaButton.click();
  }

  /**
   * Clicks a named product in the nav bar.
   * @param {'Renters'|'Homeowners'|'Car'|'Pet'|'Life'|'Giveback'} product
   */
  async navigateTo(product) {
    const map = {
      Renters:    this.navRenters,
      Homeowners: this.navHomeowners,
      Car:        this.navCar,
      Pet:        this.navPet,
      Life:       this.navLife,
      Giveback:   this.navGiveback,
    };

    const link = map[product];
    if (!link) throw new Error(`Unknown product: "${product}". Valid options: ${Object.keys(map).join(', ')}`);

    await link.click();
  }

  /**
   * Returns the list of nav link locators so tests can assert visibility.
   */
  getMainNavLinks() {
    return [
      this.navRenters,
      this.navHomeowners,
      this.navCar,
      this.navPet,
      this.navLife,
      this.navGiveback,
    ];
  }

  /** Convenience: checks all main nav items are visible */
  async checkMainNavLinks() {
    for (const link of this.getMainNavLinks()) {
      await link.waitFor({ state: 'visible' });
    }
  }
}

module.exports = { HomePage, NAV_LINKS };
