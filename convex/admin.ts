import type { GenericCtx } from "@convex-dev/better-auth";
import { paginationOptsValidator, paginationResultValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { DataModel, Id } from "./_generated/dataModel";
import { mutation, type QueryCtx, query } from "./_generated/server";
import { authComponent } from "./auth";
import schema from "./schema";

const locale = v.union(v.literal("en"), v.literal("nl"));

// Every signed-in Better Auth user is treated as an admin.
async function requireAdmin(ctx: GenericCtx<DataModel>) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new ConvexError("Not authenticated");
  }
  return user;
}

async function getContact(ctx: QueryCtx, contactId: Id<"contact">) {
  const contact = await ctx.db.get(contactId);
  return {
    email: contact?.email ?? "",
    name: contact?.name ?? null,
    locale: contact?.locale ?? null,
  };
}

export const listDonations = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(
    v.object({
      _id: v.id("donation"),
      email: v.string(),
      name: v.union(v.string(), v.null()),
      purpose: v.string(),
      frequency: v.union(v.literal("monthly"), v.literal("once")),
      amount: v.number(),
      refundedAmount: v.number(),
      currency: v.string(),
      status: v.union(v.literal("paid"), v.literal("partially_refunded"), v.literal("refunded")),
      paidAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const result = await ctx.db.query("donation").order("desc").paginate(args.paginationOpts);
    const page = await Promise.all(
      result.page.map(async (donation) => {
        const contact = await getContact(ctx, donation.contactId);
        return {
          _id: donation._id,
          email: contact.email,
          name: contact.name,
          purpose: donation.purpose,
          frequency: donation.frequency,
          amount: donation.amount,
          refundedAmount: donation.refundedAmount,
          currency: donation.currency,
          status: donation.status,
          paidAt: donation.paidAt,
        };
      }),
    );

    return { ...result, page };
  },
});

export const listContactMessages = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(
    v.object({
      _id: v.id("contactMessage"),
      name: v.string(),
      email: v.string(),
      subject: v.string(),
      message: v.string(),
      locale,
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const result = await ctx.db.query("contactMessage").order("desc").paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((message) => ({
        _id: message._id,
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        locale: message.locale,
        createdAt: message.createdAt,
      })),
    };
  },
});

export const listNewsletterSubscribers = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(
    v.object({
      _id: v.id("newsletterSubscriber"),
      email: v.string(),
      name: v.union(v.string(), v.null()),
      locale: v.union(locale, v.null()),
      status: v.union(v.literal("pending"), v.literal("active"), v.literal("unsubscribed")),
      subscribedAt: v.number(),
      unsubscribedAt: v.union(v.number(), v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const result = await ctx.db
      .query("newsletterSubscriber")
      .order("desc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      result.page.map(async (subscriber) => {
        const contact = await getContact(ctx, subscriber.contactId);
        return {
          _id: subscriber._id,
          email: contact.email,
          name: contact.name,
          locale: contact.locale,
          status: subscriber.status,
          subscribedAt: subscriber.subscribedAt,
          unsubscribedAt: subscriber.unsubscribedAt ?? null,
        };
      }),
    );

    return { ...result, page };
  },
});

export const listNewsletters = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: paginationResultValidator(
    v.object({
      _id: v.id("newsletter"),
      title: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const result = await ctx.db
      .query("newsletter")
      .withIndex("by_updated_at")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((newsletter) => ({
        _id: newsletter._id,
        title: newsletter.title,
        createdAt: newsletter.createdAt,
        updatedAt: newsletter.updatedAt,
      })),
    };
  },
});

export const getNewsletter = query({
  args: { newsletterId: v.id("newsletter") },
  returns: v.union(schema.doc("newsletter"), v.null()),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.newsletterId);
  },
});

export const createNewsletter = mutation({
  args: {
    title: v.string(),
    contentNl: v.string(),
    contentEn: v.string(),
  },
  returns: v.id("newsletter"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();

    return await ctx.db.insert("newsletter", {
      title: args.title,
      contentNl: args.contentNl,
      contentEn: args.contentEn,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateNewsletter = mutation({
  args: {
    newsletterId: v.id("newsletter"),
    title: v.string(),
    contentNl: v.string(),
    contentEn: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const newsletter = await ctx.db.get(args.newsletterId);
    if (!newsletter) {
      throw new ConvexError("Newsletter not found");
    }

    await ctx.db.patch(args.newsletterId, {
      title: args.title,
      contentNl: args.contentNl,
      contentEn: args.contentEn,
      updatedAt: Date.now(),
    });
    return null;
  },
});
