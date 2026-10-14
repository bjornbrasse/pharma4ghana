import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { authComponent } from "./auth";
import schema from "./schema";

const messageWithImage = schema.doc("message").extend({
  imageUrl: v.union(v.string(), v.null()),
  ogImageUrl: v.union(v.string(), v.null()),
  imageAlt: v.optional(v.string()),
});

async function getImageUrls(ctx: QueryCtx, imageId: Id<"image"> | undefined) {
  if (!imageId) return { imageUrl: null, ogImageUrl: null, imageAlt: undefined };
  const image = await ctx.db.get(imageId);
  if (!image) return { imageUrl: null, ogImageUrl: null, imageAlt: undefined };
  const blog = image.variants.find((entry) => entry.purpose === "blog");
  const thumbnail = image.variants.find((entry) => entry.purpose === "thumbnail");
  const [imageUrl, ogImageUrl] = await Promise.all([
    blog ? ctx.storage.getUrl(blog.storageId) : null,
    thumbnail ? ctx.storage.getUrl(thumbnail.storageId) : null,
  ]);
  return { imageUrl, ogImageUrl, imageAlt: image.imageAlt };
}

export const list = query({
  args: {},
  returns: v.array(messageWithImage),
  handler: async (ctx) => {
    const messages = await ctx.db
      .query("message")
      .withIndex("by_updated_at")
      .order("desc")
      .take(50);
    return await Promise.all(
      messages.map(async (message) => {
        const urls = await getImageUrls(ctx, message.imageId);
        return {
          ...message,
          ...urls,
          imageUrl: urls.imageUrl ?? message.image ?? null,
        };
      }),
    );
  },
});

export const get = query({
  args: { messageId: v.id("message") },
  returns: v.union(messageWithImage, v.null()),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return null;
    const urls = await getImageUrls(ctx, message.imageId);
    return {
      ...message,
      ...urls,
      imageUrl: urls.imageUrl ?? message.image ?? null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    contentNl: v.string(),
    contentEn: v.string(),
    imageId: v.id("image"),
    publishedAt: v.optional(v.number()),
    imageClasses: v.string(),
    externalLinks: v.array(
      v.object({
        label: v.string(),
        href: v.string(),
      }),
    ),
    hashtags: v.array(v.string()),
  },
  returns: v.id("message"),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("message", {
      authorId: user._id,
      title: args.title,
      contentNl: args.contentNl,
      contentEn: args.contentEn,
      imageId: args.imageId,
      publishedAt: args.publishedAt ?? now,
      ...(args.imageClasses ? { imageClasses: args.imageClasses } : {}),
      externalLinks: args.externalLinks,
      hashtags: args.hashtags,
      createdAt: now,
      updatedAt: now,
    });

    if (args.publishedAt === undefined) {
      const message = await ctx.db.get(messageId);
      if (!message) throw new ConvexError("Message not found after creation");
      await ctx.db.patch(messageId, { publishedAt: message._creationTime });
    }

    return messageId;
  },
});

export const update = mutation({
  args: {
    messageId: v.id("message"),
    title: v.string(),
    contentNl: v.string(),
    contentEn: v.string(),
    imageId: v.id("image"),
    imageClasses: v.string(),
    externalLinks: v.array(
      v.object({
        label: v.string(),
        href: v.string(),
      }),
    ),
    hashtags: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new ConvexError("Message not found");
    }

    await ctx.db.patch(args.messageId, {
      title: args.title,
      contentNl: args.contentNl,
      contentEn: args.contentEn,
      imageId: args.imageId,
      imageClasses: args.imageClasses,
      externalLinks: args.externalLinks,
      hashtags: args.hashtags,
      updatedAt: Date.now(),
    });
    return null;
  },
});
