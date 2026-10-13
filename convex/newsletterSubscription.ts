"use node";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { ConvexError, v } from "convex/values";
import nodemailer from "nodemailer";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action, type ActionCtx } from "./_generated/server";
import { assertSyncSecret, authComponent } from "./auth";
import { getTransporter } from "./lib/email.js";

const confirmationLifetimeMs = 48 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function signUnsubscribeToken(subscriberId: Id<"newsletterSubscriber">, secret: string) {
  const signature = createHmac("sha256", secret).update(subscriberId).digest("base64url");
  return `${subscriberId}.${signature}`;
}

function verifyUnsubscribeToken(token: string, secret: string) {
  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex < 1) {
    return null;
  }

  const subscriberId = token.slice(0, separatorIndex) as Id<"newsletterSubscriber">;
  const suppliedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = createHmac("sha256", secret).update(subscriberId).digest("base64url");
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return subscriberId;
}

function createLifecycleUrl(siteUrl: string, path: string, token: string) {
  const url = new URL(path, `${siteUrl.replace(/\/$/, "")}/`);
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendConfirmationEmail(args: {
  email: string;
  name?: string;
  locale: "en" | "nl";
  confirmationUrl: string;
  unsubscribeUrl: string;
}) {
  const dutch = args.locale === "nl";
  const firstName = args.name?.trim().split(/\s+/)[0];
  const transporter = await getTransporter();
  const subject = dutch
    ? "Welkom - bevestig uw inschrijving voor de Pharma4Ghana-nieuwsbrief"
    : "Welcome - confirm your Pharma4Ghana newsletter subscription";
  const intro = dutch
    ? `Welkom${firstName ? ` ${firstName}` : ""} bij de nieuwsbrief van Pharma4Ghana. Bevestig uw inschrijving via onderstaande link. Deze link is 48 uur geldig.`
    : `Welcome${firstName ? ` ${firstName}` : ""} to the Pharma4Ghana newsletter. Confirm your subscription using the link below. This link is valid for 48 hours.`;
  const cancel = dutch
    ? "Heeft u dit niet aangevraagd? Annuleer de inschrijving."
    : "Did not request this? Cancel the subscription.";

  const info = await transporter.sendMail({
    from:
      process.env.NEWSLETTER_FROM ??
      process.env.SMTP_USER ??
      "Pharma4Ghana <newsletter@pharma4ghana.com>",
    to: args.email,
    subject,
    text: `${intro}\n\n${args.confirmationUrl}\n\n${cancel}\n${args.unsubscribeUrl}`,
    html: `<p>${intro}</p><p><a href="${args.confirmationUrl}">${
      dutch ? "Inschrijving bevestigen" : "Confirm subscription"
    }</a></p><p>${cancel} <a href="${args.unsubscribeUrl}">${
      dutch ? "Inschrijving annuleren" : "Cancel subscription"
    }</a></p>`,
  });

  console.log("Newsletter confirmation sent:", info.response);
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("Preview: %s", previewUrl);
  }
}

async function beginAndSendSubscription(
  ctx: ActionCtx,
  args: {
    syncSecret: string;
    email: string;
    name?: string;
    locale: "en" | "nl";
    siteUrl: string;
  },
): Promise<"accepted"> {
  const email = args.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ConvexError("Invalid email address");
  }

  const token = randomBytes(32).toString("base64url");
  const subscription = await ctx.runMutation(internal.newsletterSubscriber.beginSubscription, {
    syncSecret: args.syncSecret,
    email,
    name: args.name?.trim() || undefined,
    locale: args.locale,
    confirmationTokenHash: hashToken(token),
    confirmationExpiresAt: Date.now() + confirmationLifetimeMs,
  });

  if (subscription.requiresConfirmation) {
    const unsubscribeToken = signUnsubscribeToken(subscription.subscriberId, args.syncSecret);
    await sendConfirmationEmail({
      email,
      name: args.name,
      locale: args.locale,
      confirmationUrl: createLifecycleUrl(args.siteUrl, "/api/newsletter/confirm", token),
      unsubscribeUrl: createLifecycleUrl(
        args.siteUrl,
        "/api/newsletter/unsubscribe",
        unsubscribeToken,
      ),
    });
  }

  return "accepted";
}

export const requestSubscription = action({
  args: {
    syncSecret: v.string(),
    email: v.string(),
    locale: v.union(v.literal("en"), v.literal("nl")),
    siteUrl: v.string(),
  },
  returns: v.literal("accepted"),
  handler: async (ctx, args): Promise<"accepted"> => {
    assertSyncSecret(args.syncSecret);
    return beginAndSendSubscription(ctx, args);
  },
});

export const addSubscriber = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
  },
  returns: v.literal("accepted"),
  handler: async (ctx, args): Promise<"accepted"> => {
    const admin = await authComponent.safeGetAuthUser(ctx);
    if (!admin) {
      throw new ConvexError("Not authenticated");
    }

    const syncSecret = process.env.CONVEX_SYNC_SECRET;
    const siteUrl = process.env.SITE_URL;
    if (!syncSecret || !siteUrl) {
      throw new Error("Missing CONVEX_SYNC_SECRET or SITE_URL in the Convex deployment.");
    }

    return beginAndSendSubscription(ctx, { ...args, syncSecret, siteUrl });
  },
});

export const resendConfirmation = action({
  args: { subscriberId: v.id("newsletterSubscriber") },
  returns: v.union(v.literal("sent"), v.literal("not_found"), v.literal("not_pending")),
  handler: async (ctx, args): Promise<"sent" | "not_found" | "not_pending"> => {
    const admin = await authComponent.safeGetAuthUser(ctx);
    if (!admin) {
      throw new ConvexError("Not authenticated");
    }

    const syncSecret = process.env.CONVEX_SYNC_SECRET;
    const siteUrl = process.env.SITE_URL;
    if (!syncSecret || !siteUrl) {
      throw new Error("Missing CONVEX_SYNC_SECRET or SITE_URL in the Convex deployment.");
    }

    const token = randomBytes(32).toString("base64url");
    const prepared = await ctx.runMutation(
      internal.newsletterSubscriber.prepareConfirmationResend,
      {
        subscriberId: args.subscriberId,
        confirmationTokenHash: hashToken(token),
        confirmationExpiresAt: Date.now() + confirmationLifetimeMs,
      },
    );

    if (prepared.status !== "ready") {
      return prepared.status;
    }

    const unsubscribeToken = signUnsubscribeToken(args.subscriberId, syncSecret);
    await sendConfirmationEmail({
      email: prepared.email,
      name: prepared.name,
      locale: prepared.locale,
      confirmationUrl: createLifecycleUrl(siteUrl, "/api/newsletter/confirm", token),
      unsubscribeUrl: createLifecycleUrl(siteUrl, "/api/newsletter/unsubscribe", unsubscribeToken),
    });
    return "sent";
  },
});

export const confirm = action({
  args: {
    syncSecret: v.string(),
    token: v.string(),
  },
  returns: v.union(v.literal("confirmed"), v.literal("invalid"), v.literal("expired")),
  handler: async (ctx, args): Promise<"confirmed" | "invalid" | "expired"> => {
    assertSyncSecret(args.syncSecret);
    return ctx.runMutation(internal.newsletterSubscriber.confirmSubscription, {
      syncSecret: args.syncSecret,
      confirmationTokenHash: hashToken(args.token),
    });
  },
});

export const unsubscribe = action({
  args: {
    syncSecret: v.string(),
    token: v.string(),
  },
  returns: v.union(v.literal("unsubscribed"), v.literal("invalid")),
  handler: async (ctx, args): Promise<"unsubscribed" | "invalid"> => {
    assertSyncSecret(args.syncSecret);
    const subscriberId = verifyUnsubscribeToken(args.token, args.syncSecret);

    if (!subscriberId) {
      return "invalid";
    }

    return ctx.runMutation(internal.newsletterSubscriber.unsubscribe, {
      syncSecret: args.syncSecret,
      subscriberId,
    });
  },
});
