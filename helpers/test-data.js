// helpers/test-data.js
// Centralised test data so tests never hard-code IDs or personal data inline.
//
// Policy IDs must come from the staging environment — ask QA lead or dev
// to seed these policies before running Blender tests.

require('dotenv').config();

function getWebsiteTestData() {
  return {
    zipCode: process.env.TEST_ZIP_CODE || '10001',
    email: process.env.TEST_EMAIL || 'test@example.com',
    // Products as they appear in navigation / onboarding URL params
    products: ['renters', 'homeowners', 'car', 'pet', 'life'],
  };
}

/**
 * Returns the policy ID for a monthly payment plan policy.
 * Set POLICY_ID_MONTHLY in your .env (get the value from staging).
 */
function getPolicyMonthly() {
  const id = process.env.POLICY_ID_MONTHLY;
  if (!id || id.includes('XXX')) {
    throw new Error(
      'POLICY_ID_MONTHLY is not set. Add a real staging policy ID to your .env file.'
    );
  }
  return id;
}

/**
 * Returns the policy ID for a semi-annual payment plan policy.
 * Set POLICY_ID_SEMI_ANNUAL in your .env.
 */
function getPolicySemiAnnual() {
  const id = process.env.POLICY_ID_SEMI_ANNUAL;
  if (!id || id.includes('XXX')) {
    throw new Error(
      'POLICY_ID_SEMI_ANNUAL is not set. Add a real staging policy ID to your .env file.'
    );
  }
  return id;
}

/**
 * Returns a cancelled policy ID (for testing disabled actions).
 */
function getPolicyCancelled() {
  const id = process.env.POLICY_ID_CANCELLED;
  if (!id || id.includes('XXX')) {
    throw new Error(
      'POLICY_ID_CANCELLED is not set. Add a real staging policy ID to your .env file.'
    );
  }
  return id;
}

/**
 * Returns a policy whose last payment was last month.
 * Used for financial message scenarios.
 */
function getPolicyLastMonth() {
  const id = process.env.POLICY_ID_LAST_MONTH;
  if (!id || id.includes('XXX')) {
    throw new Error(
      'POLICY_ID_LAST_MONTH is not set. Add a real staging policy ID to your .env file.'
    );
  }
  return id;
}

function getApiToken() {
  const token = process.env.API_TOKEN;
  if (!token) {
    throw new Error('API_TOKEN is not set in your .env file.');
  }
  return token;
}

module.exports = {
  getWebsiteTestData,
  getPolicyMonthly,
  getPolicySemiAnnual,
  getPolicyCancelled,
  getPolicyLastMonth,
  getApiToken,
};
