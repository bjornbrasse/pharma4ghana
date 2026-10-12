import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export type ContactAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

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

export type SubscriptionSyncInput = {
  stripeEventId: string;
  stripeEventCreatedAt: number;
  email: string;
  name?: string;
  locale?: Locale;
  address?: ContactAddress;
  stripeSubscriptionId: string;
  subscriptionStatus: string;
  cancelAtPeriodEnd: boolean;
  purpose: string;
  amount: number;
  currency: string;
  stripePriceId: string;
  stripeProductId: string;
  quantity: number;
};

export type PaidDonationInput = {
  stripeEventId: string;
  email: string;
  name?: string;
  locale?: Locale;
  address?: ContactAddress;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeCheckoutSessionId?: string;
  purpose: string;
  frequency: "monthly" | "once";
  amount: number;
  currency: string;
  paidAt: number;
};

type RefundInput = {
  stripePaymentIntentId: string;
  refundedAmount: number;
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

export async function syncContactSubscription(input: SubscriptionSyncInput) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.contactSubscription.syncSubscription, {
    ...input,
    syncSecret,
  });
}

export async function recordPaidDonation(input: PaidDonationInput) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.donation.recordPaid, { ...input, syncSecret });
}

export async function recordDonationRefund(input: RefundInput) {
  const { url, syncSecret } = getConvexConfig();
  return getConvexClient(url).mutation(api.donation.recordRefund, { ...input, syncSecret });
}
