import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { upsertContact } from "./model";

export const upsertFromApp = mutation({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
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
