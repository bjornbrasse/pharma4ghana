import { expect, test } from "@playwright/test";
import { convexTest } from "convex-test";
import { api } from "../../convex/_generated/api";
import * as serverModule from "../../convex/_generated/server";
import * as donationModule from "../../convex/donation";
import * as donorModule from "../../convex/donor";
import schema from "../../convex/schema";
import { getDonationPurposeForProduct } from "../../src/lib/donation-options";

const modules = {
  "../../convex/_generated/server.ts": async () => serverModule,
  "../../convex/donor.ts": async () => donorModule,
  "../../convex/donation.ts": async () => donationModule,
};
const subscription = {
  syncSecret: "subscription-test-secret",
  stripeEventId: "evt_created",
  stripeEventCreatedAt: 1000,
  stripeCustomerId: "cus_donor",
  email: "donor@example.com",
  stripeSubscriptionId: "sub_monthly",
  subscriptionStatus: "active",
  cancelAtPeriodEnd: false,
  purpose: "custom",
  amount: 2500,
  currency: "eur",
  stripePriceId: "price_25",
  stripeProductId: "prod_VQ7q4uWIuTJeNR",
  quantity: 1,
};

test.beforeEach(() => {
  process.env.CONVEX_SYNC_SECRET = subscription.syncSecret;
});

test("portal product changes override stale checkout metadata in donor and history", async () => {
  const t = convexTest(schema, modules);
  const donorId = await t.mutation(api.donor.syncSubscription, {
    ...subscription,
    purpose: "student",
    amount: 4000,
    stripeProductId: "prod_VQDANH8xfnZjUt",
  });
  const product = "prod_VQ7q4uWIuTJeNR";
  await t.mutation(api.donor.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_portal_product_change",
    stripeEventCreatedAt: 2000,
    purpose: getDonationPurposeForProduct(product, "student"),
    stripeProductId: product,
    amount: 1000,
    stripePriceId: "price_custom_10",
  });
  expect(await t.run((ctx) => ctx.db.get(donorId))).toMatchObject({
    currentPurpose: "custom",
    currentAmount: 1000,
  });
  const history = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_donor_and_valid_to", (q) => q.eq("donorId", donorId))
      .collect(),
  );
  expect(history).toHaveLength(2);
  expect(history.find((row) => row.validTo === undefined)).toMatchObject({
    purpose: "custom",
    amount: 1000,
    stripeProductId: product,
  });
  expect(getDonationPurposeForProduct("legacy_product", "student")).toBe("student");
});

test("versions monthly changes, cancellation and replacement without duplicate or stale rows", async () => {
  const t = convexTest(schema, modules);
  const donorId = await t.mutation(api.donor.syncSubscription, subscription);
  const changed = {
    ...subscription,
    stripeEventId: "evt_changed",
    stripeEventCreatedAt: 2000,
    amount: 4000,
    stripePriceId: "price_40",
  };
  await t.mutation(api.donor.syncSubscription, changed);
  await t.mutation(api.donor.syncSubscription, changed);
  await t.mutation(api.donor.syncSubscription, {
    ...changed,
    stripeEventId: "evt_unchanged",
    stripeEventCreatedAt: 3000,
  });
  await t.mutation(api.donor.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_delayed",
    stripeEventCreatedAt: 1500,
  });
  const rows = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_donor_and_valid_to", (q) => q.eq("donorId", donorId))
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
  expect(await t.run((ctx) => ctx.db.get(donorId))).toMatchObject({ currentAmount: 4000 });

  await t.mutation(api.donor.syncSubscription, {
    ...changed,
    stripeEventId: "evt_cancel_scheduled",
    stripeEventCreatedAt: 4000,
    cancelAtPeriodEnd: true,
  });
  await t.mutation(api.donor.syncSubscription, {
    ...changed,
    stripeEventId: "evt_canceled",
    stripeEventCreatedAt: 5000,
    subscriptionStatus: "canceled",
  });
  await t.mutation(api.donor.syncSubscription, {
    ...subscription,
    stripeEventId: "evt_replacement",
    stripeEventCreatedAt: 6000,
    stripeSubscriptionId: "sub_replacement",
  });
  const history = await t.run((ctx) =>
    ctx.db
      .query("donationSubscription")
      .withIndex("by_donor_and_valid_to", (q) => q.eq("donorId", donorId))
      .collect(),
  );
  expect(history).toHaveLength(5);
  expect(history.filter((row) => row.validTo === undefined)).toHaveLength(1);
  expect(await t.run((ctx) => ctx.db.get(donorId))).toMatchObject({
    stripeSubscriptionId: "sub_replacement",
    currentAmount: 2500,
    subscriptionStatus: "active",
  });
});

test("invoice payments do not replace the recurring amount or subscription status", async () => {
  const t = convexTest(schema, modules);
  const donorId = await t.mutation(api.donor.syncSubscription, subscription);
  await t.mutation(api.donation.recordPaid, {
    syncSecret: subscription.syncSecret,
    stripeEventId: "evt_prorated_payment",
    stripeCustomerId: subscription.stripeCustomerId,
    email: subscription.email,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    subscriptionStatus: "past_due",
    stripeInvoiceId: "in_prorated",
    purpose: "custom",
    frequency: "monthly",
    amount: 500,
    currency: "eur",
    paidAt: 2000,
  });
  expect(await t.run((ctx) => ctx.db.get(donorId))).toMatchObject({
    currentAmount: 2500,
    subscriptionStatus: "active",
  });
});

test("subscription history cannot be written with an invalid sync secret", async () => {
  const t = convexTest(schema, modules);
  await expect(
    t.mutation(api.donor.syncSubscription, {
      ...subscription,
      syncSecret: "invalid",
    }),
  ).rejects.toThrow("Invalid Convex sync secret");
  expect(await t.run((ctx) => ctx.db.query("donationSubscription").collect())).toHaveLength(0);
});
