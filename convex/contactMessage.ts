import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact } from "./model";

export const create = mutation({
  args: {
    syncSecret: v.string(),
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    locale: v.union(v.literal("en"), v.literal("nl")),
  },
  returns: v.id("contactMessage"),
  handler: async (ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const contactId = await upsertContact(ctx, {
      email: args.email,
      name: args.name,
      locale: args.locale,
      source: "contact",
    });

    return ctx.db.insert("contactMessage", {
      contactId,
      name: args.name,
      email: args.email.trim().toLowerCase(),
      subject: args.subject,
      message: args.message,
      locale: args.locale,
      createdAt: Date.now(),
    });
  },
});
