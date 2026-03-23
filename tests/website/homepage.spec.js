// tests/website/homepage.spec.js
// Tests for the Lemonade public homepage: https://www.lemonade.com

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/website/homepage');

test.describe('Homepage', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('page title is correct', async () => {
    const title = await homePage.getTitle();
    // Observed title: "Lemonade: An Insurance Company Built for the 21st Century"
    // Note: if this test gets a Cloudflare challenge ("Just a moment...") it will
    // fail with a clear message. The retry handles it — the IP clears while the
    // first attempt waits, and the retry navigates to the real page.
    expect(title).toContain('Lemonade');
  });

  test('hero heading is visible', async () => {
    await expect(homePage.heroHeading).toBeVisible();
    const text = await homePage.heroHeading.textContent();
    expect(text.toLowerCase()).toContain('forget everything');
  });

  test('hero subheading is visible', async () => {
    await expect(homePage.heroSubheading).toBeVisible();
  });

  test('main navigation links are all visible', async () => {
    await homePage.checkMainNavLinks();

    for (const link of homePage.getMainNavLinks()) {
      await expect(link).toBeVisible();
    }
  });

  test('get a quote CTA is visible and clickable', async ({ page }) => {
    await expect(homePage.heroCtaButton).toBeVisible();

    // Click and confirm we land somewhere in the onboarding/quote flow
    await homePage.clickGetQuote();
    await expect(page).toHaveURL(/\/(start|onboarding)/);
  });

  test('page loads within acceptable time', async ({ page }) => {
    // Re-navigate so we capture timing fresh (beforeEach already loaded once,
    // but we want a clean measurement)
    await page.goto('/');
    const loadTime = await homePage.measureLoadTime();

    // 5 seconds is a reasonable ceiling for a marketing page on a real connection.
    // Tighten this if performance budgets are set by the team.
    expect(loadTime).toBeLessThan(5_000);
  });
});
