import { expect, test } from "@playwright/test";
import { convexTest } from "convex-test";
import { api, internal } from "../../convex/_generated/api";
import * as serverModule from "../../convex/_generated/server";
import * as contactModule from "../../convex/contact";
import * as contactSubscriptionModule from "../../convex/contactSubscription";
import * as donationModule from "../../convex/donation";
import * as newsletterSubscriberModule from "../../convex/newsletterSubscriber";
import {
  renderAnnualDonationOverviewPdf,
  renderMonthlyDonationPdf,
  renderOneTimeDonationPdf,
} from "../../convex/lib/email/donation_pdfs";
import schema from "../../convex/schema";
import { donationOptions, getDonationPurposeForProduct } from "../../src/lib/donation-options";

const modules = {
  "../../convex/_generated/server.ts": async () => serverModule,
  "../../convex/contact.ts": async () => contactModule,
  "../../convex/contactSubscription.ts": async () => contactSubscriptionModule,
  "../../convex/donation.ts": async () => donationModule,
  "../../convex/newsletterSubscriber.ts": async () => newsletterSubscriberModule,
};
const subscription = {
  stripeEventId: "evt_created",
  stripeEventCreatedAt: 1000,
  email: "donor@example.com",
  stripeSubscriptionId: "sub_monthly",
  subscriptionStatus: "active",
  cancelAtPeriodEnd: false,
  purpose: "custom",
  amount: 2500,
  currency: "eur",
  stripePriceId: "price_25",
  stripeProductId: donationOptions.custom.stripeProductId,
  quantity: 1,
};

async function seedCheckoutContact(
  t: ReturnType<typeof convexTest>,
  email = subscription.email,
  newsletterOptIn = false,
) {
  return t.run(async (ctx) => {
    const now = Date.now();
    const contactId = await ctx.db.insert("contact", {
      email,
      name: "Test Donor",
      locale: "en",
      firstSource: "stripe",
      lastSource: "stripe",
      createdAt: now,
      updatedAt: now,
    });

    if (newsletterOptIn) {
      await ctx.db.insert("newsletterSubscriber", {
        contactId,
        status: "pending",
        consentedAt: now,
        subscribedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return contactId;
  });
}

test("prepares a donation contact and newsletter subscriber before Stripe checkout", async () => {
  const t = convexTest(schema, modules);
  const previousSecret = process.env.CONVEX_SYNC_SECRET;
  process.env.CONVEX_SYNC_SECRET = "test-sync-secret";

  try {
    const contactId = await t.mutation(api.contact.prepareDonationCheckout, {
      syncSecret: "test-sync-secret",
      email: "Donor@Example.com",
      name: "Test Donor",
      locale: "nl",
      newsletterOptIn: true,
    });
    const [contact, subscribers] = await t.run(async (ctx) =>
      Promise.all([
        ctx.db.get(contactId),
        ctx.db
          .query("newsletterSubscriber")
          .withIndex("by_contact", (query) => query.eq("contactId", contactId))
          .collect(),
      ]),
    );

    expect(contact).toMatchObject({
      email: "donor@example.com",
      name: "Test Donor",
      locale: "nl",
    });
    expect(subscribers).toHaveLength(1);
    expect(subscribers[0]).toMatchObject({
      status: "pending",
      consentedAt: expect.any(Number),
    });
  } finally {
    if (previousSecret === undefined) {
      delete process.env.CONVEX_SYNC_SECRET;
    } else {
      process.env.CONVEX_SYNC_SECRET = previousSecret;
    }
  }
});

test("handles newsletter confirmation, duplicate requests, unsubscribe, and resubscribe", async () => {
  const t = convexTest(schema, modules);
  const previousSecret = process.env.CONVEX_SYNC_SECRET;
  process.env.CONVEX_SYNC_SECRET = "test-sync-secret";

  try {
    const initial = await t.mutation(internal.newsletterSubscriber.beginSubscription, {
      syncSecret: "test-sync-secret",
      email: "  Supporter@Example.com ",
      name: "Test Supporter",
      locale: "en",
      confirmationTokenHash: "initial-token-hash",
      confirmationExpiresAt: Date.now() + 60_000,
    });
    const initialSubscriber = await t.run((ctx) =>
      ctx.db.get("newsletterSubscriber", initial.subscriberId),
    );
    const contact = await t.run((ctx) =>
      ctx.db
        .query("contact")
        .withIndex("by_email", (query) => query.eq("email", "supporter@example.com"))
        .unique(),
    );

    expect(initial.requiresConfirmation).toBe(true);
    expect(contact).toMatchObject({
      email: "supporter@example.com",
      name: "Test Supporter",
    });
    expect(initialSubscriber).toMatchObject({
      status: "pending",
      confirmationTokenHash: "initial-token-hash",
    });

    await expect(
      t.mutation(internal.newsletterSubscriber.confirmSubscription, {
        syncSecret: "test-sync-secret",
        confirmationTokenHash: "initial-token-hash",
      }),
    ).resolves.toBe("confirmed");
    await expect(
      t.mutation(internal.newsletterSubscriber.confirmSubscription, {
        syncSecret: "test-sync-secret",
        confirmationTokenHash: "initial-token-hash",
      }),
    ).resolves.toBe("invalid");

    const duplicate = await t.mutation(internal.newsletterSubscriber.beginSubscription, {
      syncSecret: "test-sync-secret",
      email: "supporter@example.com",
      locale: "nl",
      confirmationTokenHash: "duplicate-token-hash",
      confirmationExpiresAt: Date.now() + 60_000,
    });
    const activeSubscriber = await t.run((ctx) =>
      ctx.db.get("newsletterSubscriber", initial.subscriberId),
    );

    expect(duplicate.requiresConfirmation).toBe(false);
    expect(activeSubscriber?.status).toBe("active");
    expect(activeSubscriber?.confirmationTokenHash).toBeUndefined();

    await expect(
      t.mutation(internal.newsletterSubscriber.unsubscribe, {
        syncSecret: "test-sync-secret",
        subscriberId: initial.subscriberId,
      }),
    ).resolves.toBe("unsubscribed");

    const resubscription = await t.mutation(internal.newsletterSubscriber.beginSubscription, {
      syncSecret: "test-sync-secret",
      email: "supporter@example.com",
      locale: "nl",
      confirmationTokenHash: "expired-token-hash",
      confirmationExpiresAt: Date.now() - 1,
    });
    const pendingSubscriber = await t.run((ctx) =>
      ctx.db.get("newsletterSubscriber", initial.subscriberId),
    );

    expect(resubscription.requiresConfirmation).toBe(true);
    expect(pendingSubscriber).toMatchObject({
      status: "pending",
      confirmationTokenHash: "expired-token-hash",
    });
    expect(pendingSubscriber?.unsubscribedAt).toBeUndefined();
    await expect(
      t.mutation(internal.newsletterSubscriber.confirmSubscription, {
        syncSecret: "test-sync-secret",
        confirmationTokenHash: "expired-token-hash",
      }),
    ).resolves.toBe("expired");
  } finally {
    if (previousSecret === undefined) {
      delete process.env.CONVEX_SYNC_SECRET;
    } else {
      process.env.CONVEX_SYNC_SECRET = previousSecret;
    }
  }
});

test("portal product changes override stale checkout metadata in contact subscription history", async () => {
  const t = convexTest(schema, modules);
  await seedCheckoutContact(t);
  const contactId = await t.mutation(internal.contactSubscription.syncSubscription, {
    ...subscription,
    purpose: "student",
    amount: 4000,
    stripeProductId: donationOptions.student.stripeProductId,
  });
  const product = donationOptions.custom.stripeProductId;
  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_portal_product_change",
    stripeEventCreatedAt: 2000,
    purpose: getDonationPurposeForProduct(product, "student"),
    stripeProductId: product,
    amount: 1000,
    stripePriceId: "price_custom_10",
  });
  const history = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_contact_and_valid_to", (q) => q.eq("contactId", contactId))
      .collect(),
  );
  expect(history).toHaveLength(2);
  expect(history.find((row) => row.validTo === undefined)).toMatchObject({
    contactId,
    purpose: "custom",
    amount: 1000,
    stripeProductId: product,
  });
  expect(getDonationPurposeForProduct("legacy_product", "student")).toBe("student");
});

test("versions monthly changes, cancellation and replacement without duplicate or stale rows", async () => {
  const t = convexTest(schema, modules);
  await seedCheckoutContact(t);
  const contactId = await t.mutation(internal.contactSubscription.syncSubscription, subscription);
  const changed = {
    ...subscription,
    stripeEventId: "evt_changed",
    stripeEventCreatedAt: 2000,
    amount: 4000,
    stripePriceId: "price_40",
  };
  await t.mutation(internal.contactSubscription.syncSubscription, changed);
  await t.mutation(internal.contactSubscription.syncSubscription, changed);
  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...changed,
    stripeEventId: "evt_unchanged",
    stripeEventCreatedAt: 3000,
  });
  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_delayed",
    stripeEventCreatedAt: 1500,
  });
  const rows = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_contact_and_valid_to", (q) => q.eq("contactId", contactId))
      .collect(),
  );
  expect(rows).toHaveLength(2);
  expect(rows.find((row) => row.amount === 2500)).toMatchObject({
    validFrom: 1000,
    validTo: 2000,
  });
  expect(rows.find((row) => row.amount === 4000)).toMatchObject({
    validFrom: 2000,
    lastStripeEventCreatedAt: 3000,
  });

  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...changed,
    stripeEventId: "evt_cancel_scheduled",
    stripeEventCreatedAt: 4000,
    cancelAtPeriodEnd: true,
  });
  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...changed,
    stripeEventId: "evt_canceled",
    stripeEventCreatedAt: 5000,
    subscriptionStatus: "canceled",
  });
  await t.mutation(internal.contactSubscription.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_replacement",
    stripeEventCreatedAt: 6000,
    stripeSubscriptionId: "sub_replacement",
  });
  const history = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_contact_and_valid_to", (q) => q.eq("contactId", contactId))
      .collect(),
  );
  expect(history).toHaveLength(5);
  expect(history.filter((row) => row.validTo === undefined)).toHaveLength(1);
  expect(history.find((row) => row.validTo === undefined)).toMatchObject({
    contactId,
    stripeSubscriptionId: "sub_replacement",
    amount: 2500,
    status: "active",
  });
});

test("invoice payments do not replace the recurring amount or subscription status", async () => {
  const t = convexTest(schema, modules);
  await seedCheckoutContact(t);
  const contactId = await t.mutation(internal.contactSubscription.syncSubscription, subscription);
  await t.mutation(internal.donation.recordPaid, {
    stripeEventId: "evt_prorated_payment",
    email: subscription.email,
    stripeInvoiceId: "in_prorated",
    purpose: "custom",
    frequency: "monthly",
    amount: 500,
    currency: "eur",
    paidAt: 2000,
  });
  const [currentSubscription] = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_contact_and_valid_to", (q) =>
        q.eq("contactId", contactId).eq("validTo", undefined),
      )
      .collect(),
  );
  const donation = await t.run((ctx) =>
    ctx.db
      .query("donation")
      .withIndex("by_invoice", (q) => q.eq("stripeInvoiceId", "in_prorated"))
      .unique(),
  );
  expect(currentSubscription).toMatchObject({
    amount: 2500,
    status: "active",
  });
  expect(donation).toMatchObject({ contactId, amount: 500 });
});

test("a paid donation schedules exactly one receipt email", async () => {
  const t = convexTest(schema, modules);
  const contactId = await seedCheckoutContact(t, "donor@example.com", true);
  const payment = {
    stripeEventId: "evt_receipt",
    email: "donor@example.com",
    name: "Test Donor",
    locale: "nl" as const,
    stripePaymentIntentId: "pi_receipt",
    purpose: "materials",
    frequency: "once" as const,
    amount: 1000,
    currency: "eur",
    paidAt: 2000,
  };

  await t.mutation(internal.donation.recordPaid, payment);
  await t.mutation(internal.donation.recordPaid, payment);

  const [donations, subscribers, scheduledFunctions] = await t.run(async (ctx) =>
    Promise.all([
      ctx.db.query("donation").collect(),
      ctx.db.query("newsletterSubscriber").collect(),
      ctx.db.system.query("_scheduled_functions").collect(),
    ]),
  );
  expect(donations).toHaveLength(1);
  expect(donations[0]).toMatchObject({ contactId });
  expect(subscribers).toHaveLength(1);
  expect(subscribers[0]).toMatchObject({
    status: "pending",
    consentedAt: expect.any(Number),
  });
  expect(scheduledFunctions).toHaveLength(1);
  expect(scheduledFunctions[0]?.args[0]).toMatchObject({
    email: payment.email,
    frequency: payment.frequency,
    paymentReference: payment.stripePaymentIntentId,
  });
});

test("a paid webhook cannot create a contact that skipped checkout", async () => {
  const t = convexTest(schema, modules);

  await expect(
    t.mutation(internal.donation.recordPaid, {
      stripeEventId: "evt_unknown_contact",
      email: "unknown@example.com",
      purpose: "custom",
      frequency: "once",
      amount: 1000,
      currency: "eur",
      paidAt: 2000,
    }),
  ).rejects.toThrow("No contact found for Stripe customer unknown@example.com.");

  const contacts = await t.run((ctx) => ctx.db.query("contact").collect());
  expect(contacts).toHaveLength(0);
});

test("renders all three donation PDF templates", async () => {
  const receipt = {
    locale: "nl" as const,
    receiptNumber: "P4G-2026-EX-0001",
    paidAt: Date.UTC(2026, 9, 12),
    amount: 5000,
    currency: "eur",
    paymentReference: "pi_example",
    donorName: "Voorbeeld Donateur",
    donorEmail: "donateur@example.com",
    subscriptionReference: "sub_example",
  };
  const pdfs = [
    await renderOneTimeDonationPdf(receipt),
    await renderMonthlyDonationPdf(receipt),
    await renderAnnualDonationOverviewPdf({
      locale: "nl",
      year: 2026,
      donorName: receipt.donorName,
      donorEmail: receipt.donorEmail,
      donations: [{ paidAt: receipt.paidAt, amount: receipt.amount, currency: receipt.currency }],
    }),
  ];

  for (const pdf of pdfs) {
    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(pdf.length).toBeGreaterThan(1_000);
  }
});
