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

interface DonorInput {
  contactId: Id<"contact">;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  cancelAtPeriodEnd?: boolean;
  currentPurpose?: string;
  currentAmount?: number;
  currency?: string;
}

export async function upsertDonor(ctx: MutationCtx, input: DonorInput) {
  const existingDonor = await ctx.db
    .query("donor")
    .withIndex("by_stripe_customer", (query) =>
      query.eq("stripeCustomerId", input.stripeCustomerId),
    )
    .unique();
  const now = Date.now();
  const subscriptionFields = {
    ...(input.stripeSubscriptionId ? { stripeSubscriptionId: input.stripeSubscriptionId } : {}),
    ...(input.subscriptionStatus ? { subscriptionStatus: input.subscriptionStatus } : {}),
    ...(input.cancelAtPeriodEnd !== undefined
      ? { cancelAtPeriodEnd: input.cancelAtPeriodEnd }
      : {}),
    ...(input.currentPurpose ? { currentPurpose: input.currentPurpose } : {}),
    ...(input.currentAmount !== undefined ? { currentAmount: input.currentAmount } : {}),
    ...(input.currency ? { currency: input.currency } : {}),
  };

  if (existingDonor) {
    await ctx.db.patch(existingDonor._id, {
      contactId: input.contactId,
      ...subscriptionFields,
      updatedAt: now,
    });

    return existingDonor._id;
  }

  return ctx.db.insert("donor", {
    contactId: input.contactId,
    stripeCustomerId: input.stripeCustomerId,
    ...subscriptionFields,
    createdAt: now,
    updatedAt: now,
  });
}
