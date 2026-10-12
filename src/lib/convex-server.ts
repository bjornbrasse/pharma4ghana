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
  locale?: Locale;
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
  return getConvexClient(url).mutation(api.newsletterSubscriber.subscribe, {
    ...input,
    syncSecret,
  });
}
