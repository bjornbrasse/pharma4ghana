import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

type Locale = "en" | "nl";

type ContactArgs = {
  syncSecret: string;
  email: string;
  name?: string;
  locale?: Locale;
};

type NewsletterArgs = {
  syncSecret: string;
  email: string;
  locale: Locale;
  siteUrl: string;
};

type DonationCheckoutContactArgs = {
  email: string;
  name: string;
  locale: Locale;
  newsletterOptIn: boolean;
};

type ContactMessageArgs = {
  email: string;
  name: string;
  subject: string;
  message: string;
  locale: Locale;
};

let convexClient: ConvexHttpClient | undefined;

function getConvexConfig() {
  const url = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
  const syncSecret = process.env.CONVEX_SYNC_SECRET;

  if (!url) {
    throw new Error("Missing CONVEX_URL.");
  }

  if (!syncSecret) {
    throw new Error("Missing CONVEX_SYNC_SECRET.");
  }

  return { url, syncSecret };
}

function getConvexClient(url: string) {
  convexClient ??= new ConvexHttpClient(url);
  return convexClient;
}

export async function upsertContact(input: Omit<ContactArgs, "syncSecret">) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.contact.upsertFromApp, { ...input, syncSecret });
}

export async function subscribeToNewsletter(input: Omit<NewsletterArgs, "syncSecret">) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).action(api.newsletterSubscription.requestSubscription, {
    ...input,
    syncSecret,
  });
}

export async function confirmNewsletterSubscription(token: string) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).action(api.newsletterSubscription.confirm, {
    syncSecret,
    token,
  });
}

export async function unsubscribeFromNewsletter(token: string) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).action(api.newsletterSubscription.unsubscribe, {
    syncSecret,
    token,
  });
}

export async function prepareDonationCheckout(input: DonationCheckoutContactArgs) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.contact.prepareDonationCheckout, {
    ...input,
    syncSecret,
  });
}

export async function recordContactMessage(input: ContactMessageArgs) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.contactMessage.create, { ...input, syncSecret });
}
