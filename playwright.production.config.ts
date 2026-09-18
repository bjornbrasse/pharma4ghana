import { defineConfig, devices } from "@playwright/test";

const appPort = 3200;

export default defineConfig({
  testDir: "./tests/e2e-production",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${appPort}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-production",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --hostname 127.0.0.1 --port ${appPort}`,
    url: `http://127.0.0.1:${appPort}`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_DIST_DIR: ".next-playwright-production",
      NEXT_PUBLIC_DONATIONS_ENABLED: "false",
    },
  },
});
