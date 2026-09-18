import { defineConfig, devices } from "@playwright/test";

const appPort = 3100;
const stripePort = 4100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/fixtures/stripe-api.mjs",
      url: `http://127.0.0.1:${stripePort}/health`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run dev -- --hostname 127.0.0.1 --port ${appPort}`,
      url: `http://127.0.0.1:${appPort}/en/donate`,
      reuseExistingServer: !process.env.CI,
      env: {
        NEXT_PUBLIC_DONATIONS_ENABLED: "true",
        NEXT_DIST_DIR: ".next-playwright",
        STRIPE_SECRET_KEY: "sk_test_playwright",
        STRIPE_API_BASE: `http://127.0.0.1:${stripePort}`,
        STRIPE_PRICE_DONATION_5_EUR: "price_test_5",
        STRIPE_PRICE_DONATION_10_EUR: "price_test_10",
        STRIPE_PRICE_DONATION_20_EUR: "price_test_20",
        STRIPE_PRICE_DONATION_30_EUR: "price_test_30",
        STRIPE_PRICE_DONATION_50_EUR: "price_test_50",
        DONATION_ORGANIZATION_NAME: "Stichting Pharma4Ghana",
        DONATION_ORGANIZATION_ADDRESS: "Teststraat 1",
        DONATION_ORGANIZATION_POSTAL_CITY: "1234 AB Amsterdam",
        DONATION_ORGANIZATION_COUNTRY: "Nederland",
        DONATION_ORGANIZATION_KVK: "12345678",
        DONATION_ORGANIZATION_RSIN: "123456789",
        DONATION_ORGANIZATION_EMAIL: "contact@pharma4ghana.com",
        DONATION_BENEFICIARY: "Pharma4Ghana - supporting pharmacy education",
      },
    },
  ],
});
