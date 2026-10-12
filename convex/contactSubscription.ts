import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { upsertContact } from "./model";

const address = v.object({
  line1: v.optional(v.string()),
  line2: v.optional(v.string()),
  city: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
});

export const syncSubscription = internalMutation({
  args: {
    stripeEventId: v.string(),
    stripeEventCreatedAt: v.number(),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    address: v.optional(address),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    purpose: v.string(),
    amount: v.number(),
    currency: v.string(),
    stripePriceId: v.string(),
    stripeProductId: v.string(),
    quantity: v.number(),
  },
  returns: v.id("contact"),
  handler: async (ctx, args) => {
    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      address: args.address,
      source: "stripe",
    });

    const duplicate = await ctx.db
      .query("donationSubscription")
      .withIndex("by_stripe_event", (q) => q.eq("stripeEventId", args.stripeEventId))
      .unique();
    if (duplicate) {
      return contactId;
    }
    const current = await ctx.db
      .query("donationSubscription")
      .withIndex("by_contact_and_valid_to", (q) =>
        q.eq("contactId", contactId).eq("validTo", undefined),
      )
      .unique();
    if (current && args.stripeEventCreatedAt < current.lastStripeEventCreatedAt) {
      return contactId;
    }
    const state = {
      stripeSubscriptionId: args.stripeSubscriptionId,
      status: args.subscriptionStatus,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      purpose: args.purpose,
      amount: args.amount,
      currency: args.currency.toLowerCase(),
      stripePriceId: args.stripePriceId,
      stripeProductId: args.stripeProductId,
      quantity: args.quantity,
    };
    const changed =
      !current ||
      current.stripeSubscriptionId !== state.stripeSubscriptionId ||
      current.status !== state.status ||
      current.cancelAtPeriodEnd !== state.cancelAtPeriodEnd ||
      current.purpose !== state.purpose ||
      current.amount !== state.amount ||
      current.currency !== state.currency ||
      current.stripePriceId !== state.stripePriceId ||
      current.stripeProductId !== state.stripeProductId ||
      current.quantity !== state.quantity;

    if (changed) {
      if (current) {
        await ctx.db.patch(current._id, { validTo: args.stripeEventCreatedAt });
      }
      await ctx.db.insert("donationSubscription", {
        contactId,
        ...state,
        stripeEventId: args.stripeEventId,
        lastStripeEventCreatedAt: args.stripeEventCreatedAt,
        validFrom: args.stripeEventCreatedAt,
        createdAt: Date.now(),
      });
    } else {
      await ctx.db.patch(current._id, {
        lastStripeEventCreatedAt: args.stripeEventCreatedAt,
      });
    }
    return contactId;
  },
});
