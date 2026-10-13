import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact, upsertNewsletterSubscriber } from "./model";

export const beginSubscription = internalMutation({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    name: v.string().optional(),
    locale: v.union(v.literal("en"), v.literal("nl")),
    confirmationTokenHash: v.string(),
    confirmationExpiresAt: v.number(),
  },
  returns: v.object({
    subscriberId: v.id("newsletterSubscriber"),
    requiresConfirmation: v.boolean(),
  }),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      source: "newsletter",
    });
    const now = Date.now();

    return upsertNewsletterSubscriber(ctx, contactId, now, {
      tokenHash: args.confirmationTokenHash,
      expiresAt: args.confirmationExpiresAt,
    });
  },
});

export const confirmSubscription = internalMutation({
  args: {
    syncSecret: v.string(),
    confirmationTokenHash: v.string(),
  },
  returns: v.union(v.literal("confirmed"), v.literal("invalid"), v.literal("expired")),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const subscriber = await ctx.db
      .query("newsletterSubscriber")
      .withIndex("by_confirmation_token_hash", (query) =>
        query.eq("confirmationTokenHash", args.confirmationTokenHash),
      )
      .unique();

    if (!subscriber || !subscriber.confirmationExpiresAt) {
      return "invalid";
    }

    const now = Date.now();

    if (subscriber.confirmationExpiresAt < now) {
      await ctx.db.patch(subscriber._id, {
        confirmationTokenHash: undefined,
        confirmationExpiresAt: undefined,
        updatedAt: now,
      });
      return "expired";
    }

    await ctx.db.patch(subscriber._id, {
      status: "active",
      confirmationTokenHash: undefined,
      confirmationExpiresAt: undefined,
      subscribedAt: now,
      unsubscribedAt: undefined,
      updatedAt: now,
    });
    return "confirmed";
  },
});

export const prepareConfirmationResend = internalMutation({
  args: {
    subscriberId: v.id("newsletterSubscriber"),
    confirmationTokenHash: v.string(),
    confirmationExpiresAt: v.number(),
  },
  returns: v.union(
    v.object({ status: v.literal("not_found") }),
    v.object({ status: v.literal("not_pending") }),
    v.object({
      status: v.literal("ready"),
      email: v.string(),
      name: v.string().optional(),
      locale: v.union(v.literal("en"), v.literal("nl")),
    }),
  ),
  handler: async (ctx, args) => {
    const subscriber = await ctx.db.get("newsletterSubscriber", args.subscriberId);

    if (!subscriber) {
      return { status: "not_found" as const };
    }

    if (subscriber.status !== "pending") {
      return { status: "not_pending" as const };
    }

    const contact = await ctx.db.get("contact", subscriber.contactId);
    if (!contact) {
      return { status: "not_found" as const };
    }

    await ctx.db.patch(subscriber._id, {
      confirmationTokenHash: args.confirmationTokenHash,
      confirmationExpiresAt: args.confirmationExpiresAt,
      updatedAt: Date.now(),
    });

    return {
      status: "ready" as const,
      email: contact.email,
      name: contact.name,
      locale: contact.locale ?? "nl",
    };
  },
});

export const unsubscribe = internalMutation({
  args: {
    syncSecret: v.string(),
    subscriberId: v.id("newsletterSubscriber"),
  },
  returns: v.union(v.literal("unsubscribed"), v.literal("invalid")),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const subscriber = await ctx.db.get("newsletterSubscriber", args.subscriberId);

    if (!subscriber) {
      return "invalid";
    }

    const now = Date.now();
    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
      confirmationTokenHash: undefined,
      confirmationExpiresAt: undefined,
      unsubscribedAt: subscriber.unsubscribedAt ?? now,
      updatedAt: now,
    });
    return "unsubscribed";
  },
});
