import { expect, test, type Page } from "@playwright/test";
import { donationPages } from "../donation-ctas";

async function completeCheckout(page: Page) {
  await page.goto("/en/donate");
  await page.getByText("Study materials", { exact: true }).click();
  await page.getByRole("button", { name: "Continue with € 10 per month" }).click();

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
      page.getByRole("heading", { level: 1, name: "Small support. A brighter future." }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Select a donation amount" })).toBeEnabled();
  });

  test("uses €1 steps and rejects a custom amount outside the allowed range", async ({ page }) => {
    await page.goto("/en/donate");
    await page.getByText("Choose your own amount", { exact: true }).click();
    const customAmount = page.getByLabel("Custom donation amount");

    await expect(customAmount).toHaveValue("");
    await expect(customAmount).toHaveAttribute("placeholder", "5 – 1,000");
    await customAmount.fill("5");
    await customAmount.press("ArrowUp");
    await expect(customAmount).toHaveValue("6");
    await customAmount.fill("4");
    await page.getByRole("button", { name: "Continue with € 4 per month" }).click();

    await expect(page.getByText("Enter a whole amount between €5 and €1,000.")).toBeVisible();
    await expect(page).toHaveURL(/\/en\/donate$/);
  });

  test("switches between monthly and one-time donations", async ({ page }) => {
    await page.goto("/en/donate");
    await page.getByRole("button", { name: /One-time donation/ }).click();

    await expect(page.getByText("What can your donation provide?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Select a donation amount" })).toBeVisible();
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
    for (const amount of [4, 5.5, 1001]) {
      const response = await request.post("/api/donations/checkout", {
        data: { amount, frequency: "once", locale: "en" },
      });

      expect(response.status()).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid donation. Amount must be a whole number between 5 and 1,000 EUR.",
      });
    }
  });
});
