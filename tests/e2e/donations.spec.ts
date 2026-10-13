import { expect, test, type Page } from "@playwright/test";
import { donationProducts } from "../../src/lib/donation-options";
import { donationPages } from "../donation-ctas";

const donorDetails = {
  donorName: "Test Donor",
  donorEmail: "donor@example.com",
  confirmEmail: "donor@example.com",
  newsletterOptIn: true,
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

async function completeCheckout(page: Page) {
  await page.goto("/en/donate");
  await page.getByText("Study materials", { exact: true }).click();
  await page.getByRole("button", { name: "Continue with € 10 per month" }).click();
  const dialog = page.getByRole("dialog", { name: "Continue to secure checkout" });
  await dialog.getByLabel("Name").fill("Test Donor");
  await dialog.getByLabel("Email address", { exact: true }).fill("donor@example.com");
  await dialog.getByLabel("Confirm email address").fill("donor@example.com");
  const popup = page.waitForEvent("popup");
  await dialog.getByRole("button", { name: "Continue securely with Stripe" }).click();

  await expect(page).toHaveURL(/\/en\/donate$/);
  page = await popup;
  await expect(page).toHaveURL(/\/en\/donate\/success\?session_id=cs_test_paid$/);
  expect(await page.evaluate(() => window.opener === null)).toBe(true);
  await expect(page.getByRole("heading", { level: 2, name: "Donation receipt" })).toBeVisible();
  await expect(page.getByText("€20.00")).toBeVisible();
  await expect(page.getByText("Test Donor")).toBeVisible();
  await expect(page.getByText("RSIN number")).toBeVisible();
  await expect(page.getByText("Pharma4Ghana - supporting pharmacy education")).toBeVisible();
  return page;
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
  test("reports blocked checkout tabs without requesting a session", async ({ page }) => {
    await page.addInitScript(() => {
      window.open = () => null;
    });
    let requested = false;
    await page.route("**/api/donations/checkout", async (route) => {
      requested = true;
      await route.abort();
    });
    await page.goto("/en/donate");
    await page.getByText("Study materials", { exact: true }).click();
    await page.getByRole("button", { name: "Continue with € 10 per month" }).click();
    const dialog = page.getByRole("dialog", { name: "Continue to secure checkout" });
    await dialog.getByLabel("Name").fill("Test Donor");
    await dialog.getByLabel("Email address", { exact: true }).fill("donor@example.com");
    await dialog.getByLabel("Confirm email address").fill("donor@example.com");
    await dialog.getByRole("button", { name: "Continue securely with Stripe" }).click();
    await expect(dialog.getByRole("alert")).toHaveText(
      "Allow new tabs in your browser, then try again to continue to payment.",
    );
    expect(requested).toBe(false);
  });

  test("closes the blank tab and reports checkout failures", async ({ page }) => {
    await page.route("**/api/donations/checkout", (route) =>
      route.fulfill({ status: 500, json: { error: "Checkout failed" } }),
    );
    await page.goto("/en/donate");
    await page.getByText("Study materials", { exact: true }).click();
    await page.getByRole("button", { name: "Continue with € 10 per month" }).click();
    const dialog = page.getByRole("dialog", { name: "Continue to secure checkout" });
    await dialog.getByLabel("Name").fill("Test Donor");
    await dialog.getByLabel("Email address", { exact: true }).fill("donor@example.com");
    await dialog.getByLabel("Confirm email address").fill("donor@example.com");
    const popup = page.waitForEvent("popup");
    await dialog.getByRole("button", { name: "Continue securely with Stripe" }).click();
    const checkoutTab = await popup;
    await expect.poll(() => checkoutTab.isClosed()).toBe(true);
    await expect(dialog.getByRole("alert")).toHaveText(
      "We couldn't start the checkout. Please try again.",
    );
    await expect(page).toHaveURL(/\/en\/donate$/);
  });

  test("collects donor details and sends newsletter consent to checkout", async ({ page }) => {
    let checkoutPayload: Record<string, unknown> | undefined;
    await page.route("**/api/donations/checkout", async (route) => {
      checkoutPayload = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        json: { url: `${new URL(route.request().url()).origin}/en/donate?status=cancel` },
      });
    });
    await page.goto("/en/donate");
    await page.getByText("Study materials", { exact: true }).click();
    await page.getByRole("button", { name: "Continue with € 10 per month" }).click();

    const dialog = page.getByRole("dialog", { name: "Continue to secure checkout" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Keep me informed about Pharma4Ghana")).toBeChecked();
    await dialog.getByLabel("Name").fill("  Test Donor  ");
    await dialog.getByLabel("Email address", { exact: true }).fill("Donor@Example.com");
    await dialog.getByLabel("Confirm email address").fill("donor@example.com");
    const popup = page.waitForEvent("popup");
    await dialog.getByRole("button", { name: "Continue securely with Stripe" }).click();
    await popup;

    await expect
      .poll(() => checkoutPayload)
      .toMatchObject({
        donorName: "Test Donor",
        donorEmail: "donor@example.com",
        confirmEmail: "donor@example.com",
        newsletterOptIn: true,
      });
  });

  test("pulses the continue button only for valid amounts and respects reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/donate");
    const submit = page.locator('button[type="submit"]');
    await expect(submit).toHaveCSS("animation-name", "none");
    await page.getByText("Study materials", { exact: true }).click();
    await expect(submit).toHaveCSS("animation-name", "donation-pulse");
    await submit.hover({ force: true });
    await expect(submit).toHaveCSS("animation-name", "none");
    await page.getByText("Choose your own amount", { exact: true }).click();
    const custom = page.getByLabel("Custom donation amount");
    await expect(submit).toHaveCSS("animation-name", "none");
    await custom.fill("4");
    await expect(submit).toHaveCSS("animation-name", "none");
    await custom.fill("73");
    await expect(submit).toHaveCSS("animation-name", "donation-pulse");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(submit).toHaveCSS("animation-name", "none");
  });

  test("opens the donation route in development", async ({ page }) => {
    await page.goto("/en/donate");

    await expect(page).toHaveURL(/\/en\/donate$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "A small gift, makes a brighter future." }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Select a donation amount" })).toBeDisabled();
    await page.getByText("Study materials", { exact: true }).click();
    await expect(page.getByRole("button", { name: "Continue with € 10 per month" })).toBeEnabled();
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

  test("slides the frequency highlight right and back on desktop and mobile", async ({ page }) => {
    await page.goto("/en/donate");
    const monthly = page.getByRole("button", { name: /Monthly support/ });
    const once = page.getByRole("button", { name: /One-time donation/ });
    const highlight = page.getByTestId("donation-frequency-highlight");
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const button of [monthly, once, monthly]) {
        await button.hover();
        await expect(button).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
        await expect(button).toHaveCSS("border-top-width", "0px");
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect
          .poll(async () => {
            const buttonBox = await button.boundingBox();
            const highlightBox = await highlight.boundingBox();
            if (!buttonBox || !highlightBox) {
              return Number.POSITIVE_INFINITY;
            }
            return (
              Math.abs(buttonBox.x - highlightBox.x) +
              Math.abs(buttonBox.width - highlightBox.width)
            );
          })
          .toBeLessThan(2);
      }
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(highlight).toHaveCSS("transition-property", "none");
  });

  test("does not warn after the user downloads the receipt", async ({ page }) => {
    page = await completeCheckout(page);

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
    page = await completeCheckout(page);

    await page.getByRole("link", { name: "Back to home" }).click();

    const leaveWarning = page.getByRole("dialog", {
      name: "Download your receipt before leaving",
    });
    await expect(leaveWarning).toBeVisible();
    await expect(page).toHaveURL(/\/en\/donate\/success\?session_id=cs_test_paid$/);
  });

  test.skip("downloads the receipt from the leave warning", async ({ page }) => {
    page = await completeCheckout(page);

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
        data: { amount, frequency: "once", locale: "en", purpose: "custom", ...donorDetails },
      });

      expect(response.status()).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid donation. Amount must be a whole number between 5 and 1,000 EUR.",
      });
    }
  });

  test("accepts the €25 computer card for both donation frequencies", async ({ page }) => {
    for (const frequency of ["monthly", "once"] as const) {
      await page.goto("/en/donate");

      if (frequency === "once") {
        await page.getByRole("button", { name: /One-time donation/ }).click();
      }

      await page.getByText("A computer", { exact: true }).click();
      const checkoutResponse = page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/donations/checkout") &&
          response.request().method() === "POST",
      );

      await page
        .getByRole("button", {
          name:
            frequency === "monthly"
              ? "Continue with € 25 per month"
              : "Continue with a € 25 donation",
        })
        .click();

      const dialog = page.getByRole("dialog", { name: "Continue to secure checkout" });
      await dialog.getByLabel("Name").fill(donorDetails.donorName);
      await dialog.getByLabel("Email address", { exact: true }).fill(donorDetails.donorEmail);
      await dialog.getByLabel("Confirm email address").fill(donorDetails.confirmEmail);
      await dialog.getByRole("button", { name: "Continue securely with Stripe" }).click();

      expect((await checkoutResponse).status()).toBe(200);
    }
  });

  test("rejects a manipulated fixed donation amount", async ({ request }) => {
    const response = await request.post("/api/donations/checkout", {
      data: {
        amount: 999,
        frequency: "monthly",
        locale: "en",
        purpose: "materials",
        ...donorDetails,
      },
    });

    expect(response.status()).toBe(400);
  });

  test("uses the option-specific Stripe product only for monthly donations", async ({
    request,
  }) => {
    for (const { purpose, amount, product } of donationProducts.map(
      ({ purpose, amount, stripeProductId }) => ({
        purpose,
        amount: amount ?? 73,
        product: stripeProductId,
      }),
    )) {
      for (const frequency of ["monthly", "once"]) {
        const response = await request.post("/api/donations/checkout", {
          data: { purpose, amount, frequency, locale: "en", ...donorDetails },
        });
        expect(response.status()).toBe(200);
        const fixtureResponse = await request.get("http://127.0.0.1:4100/checkout-request");
        expect(fixtureResponse.status()).toBe(200);
        const checkout = await fixtureResponse.json();
        expect(checkout["line_items[0][price_data][unit_amount]"]).toBe(String(amount * 100));
        expect(checkout["metadata[purpose]"]).toBe(purpose);
        expect(checkout.customer).toBe("cus_test_donor");
        expect(checkout["metadata[newsletter_opt_in]"]).toBe("true");
        if (frequency === "monthly") {
          expect(checkout["mode"]).toBe("subscription");
          expect(checkout["line_items[0][price_data][product]"]).toBe(product);
          expect(checkout["line_items[0][price_data][recurring][interval]"]).toBe("month");
          expect(checkout["line_items[0][price_data][product_data][name]"]).toBeUndefined();
          expect(checkout["subscription_data[metadata][purpose]"]).toBe(purpose);
          expect(checkout["subscription_data[metadata][newsletter_opt_in]"]).toBe("true");
        } else {
          expect(checkout["mode"]).toBe("payment");
          expect(checkout["line_items[0][price_data][product]"]).toBeUndefined();
          expect(checkout["line_items[0][price_data][product_data][name]"]).toBe(
            "Donation to Pharma4Ghana",
          );
          expect(checkout["line_items[0][price_data][recurring][interval]"]).toBeUndefined();
        }
      }
    }

    const customerResponse = await request.get("http://127.0.0.1:4100/customer-request");
    expect(customerResponse.status()).toBe(200);
    await expect(customerResponse.json()).resolves.toMatchObject({
      email: donorDetails.donorEmail,
      name: donorDetails.donorName,
      "metadata[newsletter_opt_in]": "true",
    });
  });
});
