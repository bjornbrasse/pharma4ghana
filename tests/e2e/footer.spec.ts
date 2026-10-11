import { expect, test } from "@playwright/test";

test("offers localized subscription management through Stripe in the footer", async ({ page }) => {
  for (const { locale, label, hint } of [
    {
      locale: "en",
      label: "Manage subscription",
      hint: "Sign in using the email address you used for your donation.",
    },
    {
      locale: "nl",
      label: "Abonnement beheren",
      hint: "Log in met het e-mailadres dat u voor uw donatie heeft gebruikt.",
    },
  ]) {
    await page.goto(`/${locale}`);
    const footer = page.getByRole("contentinfo");
    const link = footer.getByRole("link", { name: label, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      "https://billing.stripe.com/p/login/test_eVqcN7aWnfZU0Ew8tPaR200",
    );
    await expect(link).toHaveAttribute("title", hint);
    const copyright = footer.getByText(/© 2026 Pharma4Ghana/);
    await expect(copyright.locator("..").getByRole("link", { name: label })).toBeVisible();
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const buttonBox = await link.boundingBox();
      const footerBox = await footer.boundingBox();
      expect(buttonBox).not.toBeNull();
      expect(footerBox).not.toBeNull();
      if (buttonBox && footerBox) {
        expect(buttonBox.x + buttonBox.width).toBeGreaterThan(footerBox.x + footerBox.width / 2);
        expect(buttonBox.y).toBeGreaterThan(footerBox.y + footerBox.height / 2);
      }
    }
  }
});
