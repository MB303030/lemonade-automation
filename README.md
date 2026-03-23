# Lemonade Automation

Playwright E2E automation for Lemonade Insurance.

Covers two areas in a **single project**:

| Area | Status | Location |
|------|--------|----------|
| Public website (`lemonade.com`) | Active — tests run | `tests/website/` |
| Blender (internal backoffice) | Skeleton — all skipped | `tests/blender/` |

---

## Coverage

| Test file | What it covers |
|-----------|----------------|
| `tests/website/homepage.spec.js` | Title, hero, nav visibility, CTA click, load time |
| `tests/website/navigation.spec.js` | Nav link destinations, logo, footer, product pages load |
| `tests/website/get-quote.spec.js` | Quote flow entry, product selection, one step through the flow |
| `tests/blender/features/change-payment-plan/change-payment-plan.spec.js` | Payment Actions button, dialog content, CANCEL, happy paths Monthly↔Semi-Annual (all skipped) |

---

## Prerequisites

### Website tests

Just install and go:

```bash
npm install
npx playwright install
```

No credentials needed. The website is publicly accessible.

---

### Blender tests (blocked — read before touching)

All Blender tests are currently **skipped** via `test.skip`. Before they can run:

1. **Staging access** — get Blender staging URL from the infra/dev team and add it to `.env` as `BLENDER_URL`.
2. **Auth method** — confirm whether Blender uses username+password login or SSO (Okta, Google Workspace, etc.). If SSO, update `helpers/auth.js` accordingly.
3. **Selectors** — every selector in `pages/blender/` is marked `// TODO`. Open Blender in a browser and fill them in. Prefer `data-testid`; fall back to `getByRole` / `getByLabel`.
4. **Test policy IDs** — ask QA lead or backend dev to seed staging with the four policy types needed (monthly, semi-annual, cancelled, last-month) and put the IDs in `.env`.
5. **API endpoints** — `helpers/api-client.js` has placeholder endpoints. Confirm with backend before using API calls in tests.

> **⚠️ Never run Blender automation against production.** The tests make write operations (change payment plan). Staging only.

---

## Setup

```bash
cp .env.example .env
# Edit .env with your values
npm install
npx playwright install
```

---

## Running tests

```bash
# All website tests (Desktop Chrome + Mobile Chrome)
npm run test:website

# Website tests on Mobile Chrome only
npm run test:website:mobile

# All Blender tests (all will skip — infrastructure only)
npm run test:blender

# Everything
npm run test:all

# Headed mode (see the browser)
npm run test:headed

# Debug mode (step through tests)
npm run test:debug

# Open HTML report after a run
npm run test:report
```

---

## Blender skeleton — what it is and what needs to happen

The `tests/blender/` folder contains a **planned but not yet runnable** test suite for the Change Payment Plan feature in Blender (Lemonade's internal CX tool).

All 15 tests are wrapped in `test.skip` with the comment:
> "TODO: implement after staging access confirmed — ask dev for selectors and test policy IDs"

The architecture is complete:
- 5 test suites covering: button state, dialog content, cancel behaviour, and both happy-path directions
- Page objects for login, dashboard, policy page, payments tab, and timeline tab
- Shared helpers for auth, API calls, and test data
- Fixtures showing the expected policy data shape

**To enable these tests:**
1. Remove `test.skip(true, ...)` from each suite in `change-payment-plan.spec.js`
2. Fill in TODO selectors in `pages/blender/`
3. Add real policy IDs to `.env`
4. Run `npm run setup:auth` to save a Blender session
5. Run `npm run test:blender`

---

## Project structure

```
lemonade-automation/
├── tests/
│   ├── website/
│   │   ├── homepage.spec.js
│   │   ├── navigation.spec.js
│   │   └── get-quote.spec.js
│   └── blender/
│       └── features/
│           └── change-payment-plan/
│               └── change-payment-plan.spec.js   ← skeleton, all skipped
├── pages/
│   ├── base-page.js
│   ├── website/
│   │   ├── homepage.js
│   │   └── get-quote-page.js
│   └── blender/
│       ├── login-page.js
│       ├── dashboard-page.js
│       └── policy/
│           ├── policy-page.js
│           ├── payments-tab.js
│           └── timeline-tab.js
├── helpers/
│   ├── auth.js
│   ├── api-client.js
│   └── test-data.js
├── fixtures/
│   └── policies.json
├── config/
│   └── environments.js
├── playwright.config.js
├── package.json
├── .env.example
└── README.md
```

---

## Cloudflare bot protection

Lemonade's public website is behind Cloudflare. When running tests from an IP that Cloudflare doesn't recognise (cloud VMs, shared office NAT, or any IP that has sent many automated requests recently), you may see:

- A "Just a moment…" challenge page instead of the real site
- HTTP 403 responses if the IP has been hard-blocked

**The project handles this in three layers:**

1. **`global-setup.js`** — Navigates to `lemonade.com` before any test runs and waits up to 5 minutes for the challenge to clear. If it clears, the browser session (including the `cf_clearance` cookie) is saved and all tests reuse it.
2. **`BasePage.goto()`** — If a challenge appears mid-test, waits up to 90 seconds for it to clear before proceeding.
3. **`retries: 2` in `playwright.config.js`** — The first attempt to a challenged URL effectively warms up the IP; subsequent retries hit the real page.

**If tests are still failing after retries:**
- Wait 30–60 minutes for the Cloudflare block to expire, then re-run.
- Run from a residential or office IP rather than a cloud VM.
- Use the [playwright-extra stealth plugin](https://github.com/berstend/puppeteer-extra/tree/master/packages/playwright-extra) for more robust bot-detection bypass.

Note: The website tests have been verified to work correctly when the IP is not Cloudflare-challenged. The test selectors and flows are based on what's actually visible at `lemonade.com`.

---

## Notes

- No TypeScript — plain JavaScript throughout.
- Selectors in website page objects use `getByRole` / `getByText` — no CSS class selectors. Lemonade's public site doesn't expose `data-testid` attributes so role-based selectors are the most stable option.
- Blender selectors use `data-testid` placeholders — switch to `getByRole` as fallback if testids aren't available in the real UI.
- The Car nav link's accessible name is "NEW Car" (Lemonade added a "NEW" badge) — the selector uses a regex to match both "Car" and "NEW Car".
- The quote flow at `/start/1` is a chat-style interface ("Maya") that collects name first, not a product picker — get-quote tests reflect the real flow.
