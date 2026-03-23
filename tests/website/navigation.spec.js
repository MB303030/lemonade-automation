// tests/website/navigation.spec.js
// Covers site navigation: nav links, logo click, footer visibility.

const { test, expect } = require('@playwright/test');
const { HomePage, NAV_LINKS } = require('../../pages/website/homepage');

test.describe('Site Navigation', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('Renters nav link navigates to renters page', async ({ page }) => {
    await homePage.navRenters.click();
    await expect(page).toHaveURL(/\/renters/);
    // Page title should mention renters insurance
    const title = await page.title();
    expect(title.toLowerCase()).toContain('renters');
  });

  test('Homeowners nav link navigates to homeowners page', async ({ page }) => {
    await homePage.navHomeowners.click();
    await expect(page).toHaveURL(/\/homeowners/);
    const title = await page.title();
    expect(title.toLowerCase()).toContain('homeowners');
  });

  test('Car nav link navigates to car insurance page', async ({ page }) => {
    await homePage.navCar.click();
    await expect(page).toHaveURL(/\/car/);
    const title = await page.title();
    expect(title.toLowerCase()).toContain('car');
  });

  test('Pet nav link navigates to pet insurance page', async ({ page }) => {
    await homePage.navPet.click();
    await expect(page).toHaveURL(/\/pet/);
    const title = await page.title();
    expect(title.toLowerCase()).toContain('pet');
  });

  test('Life nav link navigates to life insurance page', async ({ page }) => {
    await homePage.navLife.click();
    await expect(page).toHaveURL(/\/life/);
    const title = await page.title();
    expect(title.toLowerCase()).toContain('life');
  });

  test('logo click returns to homepage', async ({ page }) => {
    // Navigate away first
    await homePage.navRenters.click();
    await expect(page).toHaveURL(/\/renters/);

    // Click logo — should go back to root.
    // Note: returning to / from a product page can trigger a Cloudflare re-challenge
    // because we're landing on / from a different origin path. The retry in playwright.config.js
    // handles this — if Cloudflare shows, the test retries and the second attempt passes.
    await homePage.logo.click();

    // Wait for Cloudflare challenge to clear if it appears
    await page.waitForFunction(
      () => !document.title.toLowerCase().includes('just a moment'),
      { timeout: 50_000 }
    );

    await expect(page).toHaveURL(/^https:\/\/www\.lemonade\.com\/?(\?.*)?$/);
  });

  test('footer links section is visible', async ({ page }) => {
    // Scroll to the bottom to make sure the footer is in view
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('product pages load without errors', async ({ page }) => {
    const productPaths = ['/renters', '/homeowners', '/car', '/pet', '/life'];

    for (const path of productPaths) {
      const response = await page.goto(path);
      // All product pages should return 200
      expect(response.status(), `${path} returned non-200`).toBe(200);
    }
  });
});
