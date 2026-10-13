import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
type Locale = "en" | "nl";
type Source = "contact" | "newsletter" | "stripe";

interface ContactAddress {
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface ContactInput {
  email: string;
  name?: string;
  locale?: Locale;
  address?: ContactAddress;
  source: Source;
}

export async function upsertContact(ctx: MutationCtx, input: ContactInput) {
  const email = input.email.trim().toLowerCase();
  const existingContact = await ctx.db
    .query("contact")
    .withIndex("by_email", (query) => query.eq("email", email))
    .unique();
  const now = Date.now();

  if (existingContact) {
    await ctx.db.patch(existingContact._id, {
      ...(input.name ? { name: input.name } : {}),
      ...(input.locale ? { locale: input.locale } : {}),
      ...(input.address ? { address: input.address } : {}),
      lastSource: input.source,
      updatedAt: now,
    });

    return existingContact._id;
  }

  return ctx.db.insert("contact", {
    email,
    ...(input.name ? { name: input.name } : {}),
    ...(input.locale ? { locale: input.locale } : {}),
    ...(input.address ? { address: input.address } : {}),
    firstSource: input.source,
    lastSource: input.source,
    createdAt: now,
    updatedAt: now,
  });
}

export async function requireStripeContact(ctx: MutationCtx, input: Omit<ContactInput, "source">) {
  const email = input.email.trim().toLowerCase();
  const contact = await ctx.db
    .query("contact")
    .withIndex("by_email", (query) => query.eq("email", email))
    .unique();

  if (!contact) {
    throw new Error(`No contact found for Stripe customer ${email}.`);
  }

  await ctx.db.patch(contact._id, {
    ...(input.name ? { name: input.name } : {}),
    ...(input.locale ? { locale: input.locale } : {}),
    ...(input.address ? { address: input.address } : {}),
    lastSource: "stripe",
    updatedAt: Date.now(),
  });

  return contact._id;
}

export async function upsertNewsletterSubscriber(
  ctx: MutationCtx,
  contactId: Id<"contact">,
  consentedAt: number,
  confirmation?: {
    tokenHash: string;
    expiresAt: number;
  },
) {
  const existingSubscriber = await ctx.db
    .query("newsletterSubscriber")
    .withIndex("by_contact", (query) => query.eq("contactId", contactId))
    .unique();

  if (existingSubscriber) {
    if (existingSubscriber.status === "active") {
      return { subscriberId: existingSubscriber._id, requiresConfirmation: false };
    }

    await ctx.db.patch(existingSubscriber._id, {
      status: "pending",
      consentedAt,
      confirmationTokenHash: confirmation?.tokenHash,
      confirmationExpiresAt: confirmation?.expiresAt,
      subscribedAt: consentedAt,
      unsubscribedAt: undefined,
      updatedAt: consentedAt,
    });

    return { subscriberId: existingSubscriber._id, requiresConfirmation: true };
  }

  const subscriberId = await ctx.db.insert("newsletterSubscriber", {
    contactId,
    status: "pending",
    consentedAt,
    confirmationTokenHash: confirmation?.tokenHash,
    confirmationExpiresAt: confirmation?.expiresAt,
    subscribedAt: consentedAt,
    createdAt: consentedAt,
    updatedAt: consentedAt,
  });

  return { subscriberId, requiresConfirmation: true };
}
