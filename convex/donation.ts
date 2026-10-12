import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact } from "./model";

const address = v.object({
  line1: v.optional(v.string()),
  line2: v.optional(v.string()),
  city: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
});

export const recordPaid = mutation({
  args: {
    syncSecret: v.string(),
    stripeEventId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    address: v.optional(address),
    stripePaymentIntentId: v.optional(v.string()),
    stripeInvoiceId: v.optional(v.string()),
    stripeCheckoutSessionId: v.optional(v.string()),
    purpose: v.string(),
    frequency: v.union(v.literal("monthly"), v.literal("once")),
    amount: v.number(),
    currency: v.string(),
    paidAt: v.number(),
  },
  returns: v.id("donation"),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const existingEvent = await ctx.db
      .query("donation")
      .withIndex("by_stripe_event", (query) => query.eq("stripeEventId", args.stripeEventId))
      .unique();

    if (existingEvent) {
      return existingEvent._id;
    }

    const paymentMatches = [
      args.stripePaymentIntentId
        ? await ctx.db
            .query("donation")
            .withIndex("by_payment_intent", (query) =>
              query.eq("stripePaymentIntentId", args.stripePaymentIntentId),
            )
            .unique()
        : null,
      args.stripeInvoiceId
        ? await ctx.db
            .query("donation")
            .withIndex("by_invoice", (query) => query.eq("stripeInvoiceId", args.stripeInvoiceId))
            .unique()
        : null,
      args.stripeCheckoutSessionId
        ? await ctx.db
            .query("donation")
            .withIndex("by_checkout_session", (query) =>
              query.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId),
            )
            .unique()
        : null,
    ];
    const existingDonation = paymentMatches.find(Boolean);

    if (existingDonation) {
      return existingDonation._id;
    }

    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      address: args.address,
      source: "stripe",
    });

    const now = Date.now();

    return ctx.db.insert("donation", {
      contactId,
      stripeEventId: args.stripeEventId,
      ...(args.stripePaymentIntentId ? { stripePaymentIntentId: args.stripePaymentIntentId } : {}),
      ...(args.stripeInvoiceId ? { stripeInvoiceId: args.stripeInvoiceId } : {}),
      ...(args.stripeCheckoutSessionId
        ? { stripeCheckoutSessionId: args.stripeCheckoutSessionId }
        : {}),
      purpose: args.purpose,
      frequency: args.frequency,
      amount: args.amount,
      currency: args.currency.toLowerCase(),
      status: "paid",
      refundedAmount: 0,
      paidAt: args.paidAt,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const recordRefund = mutation({
  args: {
    syncSecret: v.string(),
    stripePaymentIntentId: v.string(),
    refundedAmount: v.number(),
  },
  returns: v.union(v.id("donation"), v.null()),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const donation = await ctx.db
      .query("donation")
      .withIndex("by_payment_intent", (query) =>
        query.eq("stripePaymentIntentId", args.stripePaymentIntentId),
      )
      .unique();

    if (!donation) {
      return null;
    }

    await ctx.db.patch(donation._id, {
      refundedAmount: args.refundedAmount,
      status: args.refundedAmount >= donation.amount ? "refunded" : "partially_refunded",
      updatedAt: Date.now(),
    });

    return donation._id;
  },
});
