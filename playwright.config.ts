import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL || "",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
      RESEND_API_KEY: "",
      CONTACT_FROM_EMAIL: "",
      CONTACT_TO_EMAIL: "",
    },
  },
});
