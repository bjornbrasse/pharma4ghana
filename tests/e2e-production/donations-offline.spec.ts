import { expect, test } from "@playwright/test";
import { donationPages } from "../donation-ctas";

test("shows the unavailable notice from every donation button", async ({ page }) => {
  for (const { path, ctas } of donationPages) {
    await page.goto(path);

    for (const { name, count } of ctas) {
      const donationButtons = page.getByRole("button", { name, exact: true });
      await expect(donationButtons).toHaveCount(count);

      for (let index = 0; index < count; index += 1) {
        await donationButtons.nth(index).click();
        await expect(
          page.getByRole("dialog", { name: "Donations temporarily unavailable" }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Close donation notice" }).click();
      }
    }
  }
});

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
