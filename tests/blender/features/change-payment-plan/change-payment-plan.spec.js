// tests/blender/features/change-payment-plan/change-payment-plan.spec.js
//
// ⚠️  ALL TESTS ARE SKIPPED.
//
// This is an intentional skeleton. These tests are planned and architecturally
// complete, but require staging access before they can run:
//   • Blender staging URL confirmed
//   • Auth method confirmed (username+password vs SSO)
//   • Selectors filled in on all page objects (see pages/blender/)
//   • Test policy IDs seeded in staging (POLICY_ID_MONTHLY, _SEMI_ANNUAL, etc.)
//
// TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs

const { test, expect } = require('@playwright/test');
const LoginPage      = require('../../../../pages/blender/login-page');
const DashboardPage  = require('../../../../pages/blender/dashboard-page');
const PolicyPage     = require('../../../../pages/blender/policy/policy-page');
const PaymentsTab    = require('../../../../pages/blender/policy/payments-tab');
const TimelineTab    = require('../../../../pages/blender/policy/timeline-tab');
const { loadAuthState } = require('../../../../helpers/auth');
const {
  getPolicyMonthly,
  getPolicySemiAnnual,
  getPolicyCancelled,
} = require('../../../../helpers/test-data');

// ─── Helpers used across suites ──────────────────────────────────────────────

/**
 * Opens a Blender policy and navigates to the Payments tab.
 * Reused by multiple test suites.
 * TODO: implement after selectors are ready.
 */
async function openPolicyPaymentsTab(page, policyId) {
  const dashboard = new DashboardPage(page);
  await dashboard.navigateToPolicy(policyId);

  const policyPage = new PolicyPage(page);
  await policyPage.goToPaymentsTab();

  return new PaymentsTab(page);
}

// ─── Suite 1: Payment Actions Button ─────────────────────────────────────────

test.describe('Payment Actions Button', () => {
  test.skip(true, 'TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs');

  test('button text says PAYMENT ACTIONS', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    const buttonText = await paymentsTab.getPaymentActionsButtonText();
    expect(buttonText.trim().toUpperCase()).toBe('PAYMENT ACTIONS');
  });

  test('menu opens on click and shows Change payment plan option', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await expect(paymentsTab.changePaymentPlanOption).toBeVisible();
  });

  test('Change payment plan option is disabled on a cancelled policy', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyCancelled());
    await paymentsTab.clickPaymentActionsButton();

    const isDisabled = await paymentsTab.isChangePaymentPlanDisabled();
    expect(isDisabled).toBe(true);
  });

  test('clicking Change payment plan on an Active policy opens the dialog', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    await expect(paymentsTab.changePaymentPlanDialog).toBeVisible();
  });
});

// ─── Suite 2: Dialog Content ──────────────────────────────────────────────────

test.describe('Dialog Content', () => {
  test.skip(true, 'TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs');

  test('monthly policy: From shows Monthly, To shows Semi-Annual', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    const fromText = await paymentsTab.dialogFromPlan.textContent();
    const toText   = await paymentsTab.dialogToPlan.textContent();

    expect(fromText.toLowerCase()).toContain('monthly');
    expect(toText.toLowerCase()).toContain('semi-annual');
  });

  test('semi-annual policy: From shows Semi-Annual, To shows Monthly', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicySemiAnnual());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    const fromText = await paymentsTab.dialogFromPlan.textContent();
    const toText   = await paymentsTab.dialogToPlan.textContent();

    expect(fromText.toLowerCase()).toContain('semi-annual');
    expect(toText.toLowerCase()).toContain('monthly');
  });

  test('dialog title is CHANGE PAYMENT PLAN', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    const title = await paymentsTab.dialogTitle.textContent();
    expect(title.trim().toUpperCase()).toBe('CHANGE PAYMENT PLAN');
  });

  test('WHAT WILL HAPPEN section is visible', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    await expect(paymentsTab.dialogWhatWillHappen).toBeVisible();
  });

  test('financial message shows one of the 4 valid scenarios', async ({ page }) => {
    // The 4 valid financial message scenarios depend on:
    //   - direction of change (monthly→semi or semi→monthly)
    //   - when the last payment was (this month vs last month)
    // TODO: confirm exact wording for all 4 scenarios with product/dev
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    const message = await paymentsTab.dialogFinancialMessage.textContent();
    expect(message.trim().length).toBeGreaterThan(0);
    // TODO: add exact string matchers once wording is confirmed by product team
  });

  test('disclaimer text says exactly "We\'ll email the user the updated policy"', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    const disclaimer = await paymentsTab.dialogDisclaimer.textContent();
    expect(disclaimer.trim()).toBe("We'll email the user the updated policy");
  });
});

// ─── Suite 3: CANCEL button ───────────────────────────────────────────────────

test.describe('CANCEL button', () => {
  test.skip(true, 'TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs');

  test('CANCEL closes the dialog', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    await expect(paymentsTab.changePaymentPlanDialog).toBeVisible();
    await paymentsTab.dialogCancelButton.click();
    await expect(paymentsTab.changePaymentPlanDialog).not.toBeVisible();
  });

  test('CANCEL does not change the payment plan', async ({ page }) => {
    const policyPage = new PolicyPage(page);
    const dashboard  = new DashboardPage(page);

    await dashboard.navigateToPolicy(getPolicyMonthly());
    await policyPage.goToPaymentsTab();

    const paymentsTab = new PaymentsTab(page);
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();
    await paymentsTab.dialogCancelButton.click();

    // Navigate to the timeline and confirm no new event was created
    await policyPage.goToTimelineTab();
    const timelineTab = new TimelineTab(page);
    const latestTitle = await timelineTab.getLatestEventTitle();

    // The most recent event should NOT mention a payment plan switch
    // TODO: confirm exact event title wording with dev
    expect(latestTitle.toLowerCase()).not.toContain('switched to');
  });
});

// ─── Suite 4: Happy Path — Monthly → Semi-Annual ──────────────────────────────

test.describe('Happy Path: Monthly → Semi-Annual', () => {
  test.skip(true, 'TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs');

  test('full flow: dialog closes after clicking CHANGE', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    await expect(paymentsTab.changePaymentPlanDialog).toBeVisible();
    await paymentsTab.dialogChangeButton.click();
    await expect(paymentsTab.changePaymentPlanDialog).not.toBeVisible();
  });

  test('payment plan is updated to Semi-Annual after change', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();
    await paymentsTab.dialogChangeButton.click();

    // Reload/refresh the payments tab and check the plan has changed
    // TODO: confirm how the updated plan is displayed on the payments tab
    await page.reload();
    // ... assert new plan label shows Semi-Annual
  });

  test('new policy version shows Change = Adjust payment plan', async ({ page }) => {
    // TODO: confirm where "policy version" info is shown in Blender
    // (might be a separate Versions tab or a section on the policy page)
  });

  test('Timeline event shows "Switched to Semi-Annual Payments"', async ({ page }) => {
    // First, perform the change
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicyMonthly());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();
    await paymentsTab.dialogChangeButton.click();

    // Navigate to timeline and check the latest event
    const policyPage  = new PolicyPage(page);
    const timelineTab = new TimelineTab(page);
    await policyPage.goToTimelineTab();

    const latestTitle = await timelineTab.getLatestEventTitle();
    expect(latestTitle).toContain('Switched to Semi-Annual Payments');
  });
});

// ─── Suite 5: Happy Path — Semi-Annual → Monthly ─────────────────────────────

test.describe('Happy Path: Semi-Annual → Monthly', () => {
  test.skip(true, 'TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs');

  test('full flow: dialog closes after clicking CHANGE', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicySemiAnnual());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();

    await expect(paymentsTab.changePaymentPlanDialog).toBeVisible();
    await paymentsTab.dialogChangeButton.click();
    await expect(paymentsTab.changePaymentPlanDialog).not.toBeVisible();
  });

  test('payment plan is updated to Monthly after change', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicySemiAnnual());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();
    await paymentsTab.dialogChangeButton.click();

    // TODO: assert updated plan label on the payments tab
    await page.reload();
    // ... assert new plan label shows Monthly
  });

  test('Timeline event shows "Switched to Monthly Payments"', async ({ page }) => {
    const paymentsTab = await openPolicyPaymentsTab(page, getPolicySemiAnnual());
    await paymentsTab.clickPaymentActionsButton();
    await paymentsTab.clickChangePaymentPlan();
    await paymentsTab.dialogChangeButton.click();

    const policyPage  = new PolicyPage(page);
    const timelineTab = new TimelineTab(page);
    await policyPage.goToTimelineTab();

    const latestTitle = await timelineTab.getLatestEventTitle();
    expect(latestTitle).toContain('Switched to Monthly Payments');
  });
});
