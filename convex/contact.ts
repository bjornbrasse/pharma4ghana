import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact, upsertNewsletterSubscriber } from "./model";

export const upsertFromApp = mutation({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  returns: v.id("contact"),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    return upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      source: "contact",
    });
  },
});

export const prepareDonationCheckout = mutation({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    name: v.string(),
    locale: v.union(v.literal("en"), v.literal("nl")),
    newsletterOptIn: v.boolean(),
  },
  returns: v.id("contact"),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      source: "stripe",
    });

    if (args.newsletterOptIn) {
      await upsertNewsletterSubscriber(ctx, contactId, Date.now());
    }

    return contactId;
  },
});
