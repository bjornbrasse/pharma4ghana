import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact, upsertDonor } from "./model";

const address = v.object({
  line1: v.optional(v.string()),
  line2: v.optional(v.string()),
  city: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.optional(v.string()),
});

export const syncSubscription = mutation({
  args: {
    syncSecret: v.string(),
    stripeCustomerId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    address: v.optional(address),
    stripeSubscriptionId: v.string(),
    subscriptionStatus: v.string(),
    cancelAtPeriodEnd: v.boolean(),
    purpose: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      address: args.address,
      source: "stripe",
    });

    return upsertDonor(ctx, {
      contactId,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      subscriptionStatus: args.subscriptionStatus,
      cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      currentPurpose: args.purpose,
      currentAmount: args.amount,
      currency: args.currency,
    });
  },
});
