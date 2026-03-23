// Centralised environment config.
// Import this in playwright.config.js and helpers — never hardcode URLs elsewhere.
//
// ⚠️  IMPORTANT: blender_staging is for STAGING only.
//     Never configure Blender automation to hit production.

require('dotenv').config();

module.exports = {
  website: {
    baseURL: process.env.BASE_URL || 'https://www.lemonade.com',
  },

  blender_staging: {
    // TODO: confirm the real staging subdomain with dev before enabling Blender tests
    baseURL: process.env.BLENDER_URL || 'https://blender-staging.lemonade.com',
    // TODO: confirm API base URL with backend team
    apiURL: process.env.API_BASE_URL || 'https://api-staging.lemonade.com',
  },
};
