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
