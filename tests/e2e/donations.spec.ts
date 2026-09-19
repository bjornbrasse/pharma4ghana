import { expect, test, type Page } from "@playwright/test";
import { donationPages } from "../donation-ctas";

async function completeCheckout(page: Page) {
  await page.goto("/en/donate");
  await page.getByRole("button", { name: "Continue to secure checkout" }).click();

  await expect(page).toHaveURL(/\/en\/donate\/success\?session_id=cs_test_paid$/);
  await expect(page.getByRole("heading", { level: 2, name: "Donation receipt" })).toBeVisible();
  await expect(page.getByText("€20.00")).toBeVisible();
  await expect(page.getByText("Test Donor")).toBeVisible();
  await expect(page.getByText("RSIN number")).toBeVisible();
  await expect(page.getByText("Pharma4Ghana - supporting pharmacy education")).toBeVisible();
}

test("does not show the unavailable notice when donations are available", async ({ page }) => {
  for (const { path, ctas } of donationPages) {
    await page.goto(path);

    for (const { name, count } of ctas) {
      await expect(page.getByRole("link", { name, exact: true })).toHaveCount(count);
    }

    await expect(page.getByText("Donations temporarily unavailable")).toHaveCount(0);
  }
});

test.describe("donation checkout", () => {
  test("opens the donation route in development", async ({ page }) => {
    await page.goto("/en/donate");

    await expect(page).toHaveURL(/\/en\/donate$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Support a Student in Ghana" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue to secure checkout" })).toBeEnabled();
  });

  test.skip("rejects an amount outside the allowed range", async ({ page }) => {
    await page.goto("/en/donate");
    await page.getByLabel("Or enter a custom amount").fill("4");
    await page.getByRole("button", { name: "Continue to secure checkout" }).click();

    await expect(page.getByText("Enter an amount between €5 and €10,000.")).toBeVisible();
    await expect(page).toHaveURL(/\/en\/donate$/);
  });

  test("does not warn after the user downloads the receipt", async ({ page }) => {
    await completeCheckout(page);

    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download PDF" }).click();
    await download;

    await page.getByRole("link", { name: "Back to home" }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(
      page.getByRole("dialog", { name: "Download your receipt before leaving" }),
    ).toHaveCount(0);
  });

  test("warns before leaving when the receipt was not downloaded", async ({ page }) => {
    await completeCheckout(page);

    await page.getByRole("link", { name: "Back to home" }).click();

    const leaveWarning = page.getByRole("dialog", {
      name: "Download your receipt before leaving",
    });
    await expect(leaveWarning).toBeVisible();
    await expect(page).toHaveURL(/\/en\/donate\/success\?session_id=cs_test_paid$/);
  });

  test.skip("downloads the receipt from the leave warning", async ({ page }) => {
    await completeCheckout(page);

    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(
      page.getByRole("dialog", { name: "Download your receipt before leaving" }),
    ).toBeVisible();

    const receiptResponse = page.context().waitForEvent("response", {
      predicate: (response) =>
        response.url().includes("/api/donations/receipt?") && response.status() === 200,
    });
    await page.getByTestId("receipt-leave-download").click();
    await receiptResponse;

    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe("receipt protection", () => {
  test("does not render a receipt for an unpaid session", async ({ page }) => {
    const response = await page.goto("/en/donate/success?session_id=cs_test_unpaid");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Donation receipt" })).toHaveCount(0);
  });

  test("downloads a PDF only for a paid session", async ({ request }) => {
    const paidResponse = await request.get(
      "/api/donations/receipt?session_id=cs_test_paid&locale=en",
    );
    expect(paidResponse.status()).toBe(200);
    expect(paidResponse.headers()["content-type"]).toBe("application/pdf");
    expect((await paidResponse.body()).subarray(0, 4).toString()).toBe("%PDF");

    const unpaidResponse = await request.get(
      "/api/donations/receipt?session_id=cs_test_unpaid&locale=en",
    );
    expect(unpaidResponse.status()).toBe(409);
  });

  test("rejects invalid checkout amounts at the API boundary", async ({ request }) => {
    const response = await request.post("/api/donations/checkout", {
      data: { amount: 4, locale: "en" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Donation amount must be between 5 and 10,000 EUR.",
    });
  });
});
