// tests/website/get-quote.spec.js
// Tests for the Lemonade quote/onboarding flow.
//
// The flow at /start/1 is a chat-style interface ("Maya") that collects
// user details step by step. The first screen asks for first name + last name.

const { test, expect } = require('@playwright/test');
const GetQuotePage = require('../../pages/website/get-quote-page');

test.describe('Get a Quote flow', () => {
  let quotePage;

  test.beforeEach(async ({ page }) => {
    quotePage = new GetQuotePage(page);
    await quotePage.goto();
  });

  test('quote flow entry page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/start/);
    const loaded = await quotePage.isLoaded();
    expect(loaded).toBe(true);
  });

  test('first step shows the greeting heading', async () => {
    await expect(quotePage.firstStepHeading).toBeVisible();
  });

  test('first name and last name fields are visible', async () => {
    await expect(quotePage.firstNameInput).toBeVisible();
    await expect(quotePage.lastNameInput).toBeVisible();
  });

  test('"Let\'s do this" button is disabled before filling in name', async () => {
    // Button should start disabled — Lemonade requires both fields before advancing
    await expect(quotePage.letsDoThisButton).toBeDisabled();
  });

  test('filling in name enables the submit button', async () => {
    // The Lemonade chat flow is a React controlled form — need click+type to
    // properly fire React's onChange rather than just fill().
    await quotePage.firstNameInput.click();
    await quotePage.firstNameInput.pressSequentially('Test', { delay: 50 });
    await quotePage.lastNameInput.click();
    await quotePage.lastNameInput.pressSequentially('User', { delay: 50 });

    // Once both name fields are filled, the button should become enabled
    await expect(quotePage.letsDoThisButton).toBeEnabled({ timeout: 10_000 });
  });
});
