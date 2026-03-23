// helpers/api-client.js
// Thin wrapper around Playwright's APIRequestContext (or plain fetch) for
// hitting the Blender backend API in tests.
//
// All endpoint paths below are TODO — confirm with the backend team before use.

const environments = require('../config/environments');

class ApiClient {
  constructor(request) {
    // request: Playwright's APIRequestContext, e.g. from test.use({ ... })
    // or passed in directly from a test fixture.
    this.request = request;
    this.baseURL = environments.blender_staging.apiURL;
    this.authToken = process.env.API_TOKEN || null;
  }

  /**
   * Set the Bearer token used in Authorization headers.
   * Call this after loginToBlender() resolves the token.
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  _headers() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  /**
   * GET {baseURL}{endpoint}
   * Returns parsed JSON body. Throws on non-2xx.
   *
   * TODO: confirm exact endpoint paths with backend team
   */
  async get(endpoint) {
    const response = await this.request.get(`${this.baseURL}${endpoint}`, {
      headers: this._headers(),
    });

    if (!response.ok()) {
      throw new Error(`GET ${endpoint} failed with status ${response.status()}`);
    }

    return response.json();
  }

  /**
   * POST {baseURL}{endpoint} with JSON body.
   * Returns parsed JSON body. Throws on non-2xx.
   *
   * TODO: confirm request/response shapes with backend team
   */
  async post(endpoint, body) {
    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this._headers(),
      data: body,
    });

    if (!response.ok()) {
      throw new Error(
        `POST ${endpoint} failed with status ${response.status()}: ${await response.text()}`
      );
    }

    return response.json();
  }
}

module.exports = ApiClient;
