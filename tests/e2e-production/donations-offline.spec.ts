import { expect, test } from "@playwright/test";

test("redirects the donation page when payments are offline in production", async ({ page }) => {
  await page.goto("/en/donate");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { name: "Support a Student in Ghana" })).toHaveCount(0);
});

test("rejects checkout when payments are offline in production", async ({ request }) => {
  const response = await request.post("/api/donations/checkout", {
    data: { amount: 20, locale: "en" },
  });

  expect(response.status()).toBe(503);
  await expect(response.json()).resolves.toEqual({
    error: "Donations are temporarily unavailable.",
  });
});
