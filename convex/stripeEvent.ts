import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const isProcessed = internalQuery({
  args: { eventId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique();

    return existing !== null;
  },
});

export const markProcessed = internalMutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .unique();

    if (!existing) {
      await ctx.db.insert("stripeEvents", {
        eventId: args.eventId,
        type: args.eventType,
        processedAt: Date.now(),
      });
    }

    return null;
  },
});
