import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

const purpose = v.union(v.literal("thumbnail"), v.literal("email"), v.literal("blog"));
const variant = v.object({
  purpose,
  storageId: v.id("_storage"),
  width: v.number(),
  height: v.number(),
  bytes: v.number(),
  mimeType: v.string(),
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    originalName: v.string(),
    imageAlt: v.optional(v.string()),
    variants: v.array(variant),
  },
  returns: v.id("image"),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const purposes = new Set(args.variants.map((entry) => entry.purpose));
    if (
      args.variants.length !== 3 ||
      !purposes.has("thumbnail") ||
      !purposes.has("email") ||
      !purposes.has("blog")
    ) {
      throw new ConvexError("Exactly one thumbnail, email, and blog variant is required");
    }

    return await ctx.db.insert("image", {
      authorId: user._id,
      originalName: args.originalName,
      ...(args.imageAlt ? { imageAlt: args.imageAlt } : {}),
      variants: args.variants,
      createdAt: Date.now(),
    });
  },
});

export const updateAlt = mutation({
  args: {
    imageId: v.id("image"),
    imageAlt: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const image = await ctx.db.get(args.imageId);
    if (!image) throw new ConvexError("Image not found");

    const imageAlt = args.imageAlt.trim();
    await ctx.db.patch(args.imageId, { imageAlt: imageAlt || undefined });
    return null;
  },
});

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("image"),
      originalName: v.string(),
      imageAlt: v.optional(v.string()),
      createdAt: v.number(),
      variants: v.array(
        v.object({
          purpose,
          storageId: v.id("_storage"),
          width: v.number(),
          height: v.number(),
          bytes: v.number(),
          mimeType: v.string(),
          url: v.union(v.string(), v.null()),
        }),
      ),
    }),
  ),
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    const images = await ctx.db.query("image").withIndex("by_created_at").order("desc").take(100);
    return await Promise.all(
      images.map(async (image) => ({
        _id: image._id,
        originalName: image.originalName,
        imageAlt: image.imageAlt,
        createdAt: image.createdAt,
        variants: await Promise.all(
          image.variants.map(async (entry) => ({
            ...entry,
            url: await ctx.storage.getUrl(entry.storageId),
          })),
        ),
      })),
    );
  },
});

export const getVariant = query({
  args: {
    imageId: v.id("image"),
    purpose,
  },
  returns: v.union(
    v.object({
      url: v.string(),
      width: v.number(),
      height: v.number(),
      imageAlt: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) return null;
    const selected = image.variants.find((entry) => entry.purpose === args.purpose);
    if (!selected) return null;
    const url = await ctx.storage.getUrl(selected.storageId);
    return url
      ? { url, width: selected.width, height: selected.height, imageAlt: image.imageAlt }
      : null;
  },
});
