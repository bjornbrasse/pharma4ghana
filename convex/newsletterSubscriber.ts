import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact } from "./model";

export const subscribe = mutation({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const contactId = await upsertContact(ctx, {
      email: args.email,
      locale: args.locale,
      source: "newsletter",
    });
    const existingSubscriber = await ctx.db
      .query("newsletterSubscriber")
      .withIndex("by_contact", (query) => query.eq("contactId", contactId))
      .unique();
    const now = Date.now();

    if (existingSubscriber) {
      if (existingSubscriber.status !== "active") {
        await ctx.db.patch(existingSubscriber._id, {
          status: "pending",
          subscribedAt: now,
          unsubscribedAt: undefined,
          updatedAt: now,
        });
      }

      return existingSubscriber._id;
    }

    return ctx.db.insert("newsletterSubscriber", {
      contactId,
      status: "pending",
      subscribedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});
