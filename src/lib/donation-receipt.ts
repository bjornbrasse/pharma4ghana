import "server-only";

import { getStripeClient } from "@/lib/stripe";

export type DonationLocale = "en" | "nl";

export interface DonationOrganization {
  name: string;
  address: string;
  postalCity: string;
  country: string;
  registrationNumber: string;
  rsin: string;
  email: string;
}

export interface DonationReceipt {
  locale: DonationLocale;
  receiptNumber: string;
  createdAt: Date;
  amountInCents: number;
  currency: string;
  paymentIntentId: string;
  paymentMethod: string;
  donorName: string;
  donorEmail: string;
  donorAddress: string[];
  beneficiary: string;
  purpose: string;
  organization: DonationOrganization;
}

export class DonationReceiptError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DonationReceiptError";
  }
}

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new DonationReceiptError(`Missing ${name}`, 503);
  }

  return value;
}

export function getDonationOrganization(): DonationOrganization {
  return {
    name: requireEnvironmentVariable("DONATION_ORGANIZATION_NAME"),
    address: requireEnvironmentVariable("DONATION_ORGANIZATION_ADDRESS"),
    postalCity: requireEnvironmentVariable("DONATION_ORGANIZATION_POSTAL_CITY"),
    country: requireEnvironmentVariable("DONATION_ORGANIZATION_COUNTRY"),
    registrationNumber: requireEnvironmentVariable("DONATION_ORGANIZATION_KVK"),
    rsin: requireEnvironmentVariable("DONATION_ORGANIZATION_RSIN"),
    email: requireEnvironmentVariable("DONATION_ORGANIZATION_EMAIL"),
  };
}

function getDonorAddress(
  address: {
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  } | null,
) {
  if (!address) {
    return [];
  }

  return [
    address.line1,
    address.line2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.state,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

export async function getDonationReceipt(
  sessionId: string,
  locale: DonationLocale,
): Promise<DonationReceipt> {
  if (!sessionId.startsWith("cs_")) {
    throw new DonationReceiptError("Invalid Checkout Session ID", 400);
  }

  const session = await getStripeClient().checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  if (session.mode !== "payment" || session.metadata?.source !== "donation-page") {
    throw new DonationReceiptError("Invalid donation session", 400);
  }

  if (session.payment_status !== "paid") {
    throw new DonationReceiptError("Donation payment is not complete", 409);
  }

  if (session.amount_total === null || session.amount_total <= 0 || session.currency !== "eur") {
    throw new DonationReceiptError("Invalid donation amount", 400);
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    throw new DonationReceiptError("Missing payment reference", 409);
  }

  return {
    locale,
    receiptNumber: session.id,
    createdAt: new Date(session.created * 1000),
    amountInCents: session.amount_total,
    currency: session.currency.toUpperCase(),
    paymentIntentId,
    paymentMethod: session.payment_method_types.join(", "),
    donorName: session.customer_details?.name ?? "-",
    donorEmail: session.customer_details?.email ?? "-",
    donorAddress: getDonorAddress(session.customer_details?.address ?? null),
    beneficiary:
      process.env.DONATION_BENEFICIARY?.trim() || "Pharma4Ghana - supporting pharmacy education",
    purpose:
      locale === "nl"
        ? "Vrijwillige donatie ter ondersteuning van farmaceutisch onderwijs"
        : "Voluntary donation supporting pharmacy education",
    organization: getDonationOrganization(),
  };
}

export function formatDonationAmount(receipt: DonationReceipt) {
  return new Intl.NumberFormat(receipt.locale === "nl" ? "nl-NL" : "en-US", {
    style: "currency",
    currency: receipt.currency,
  }).format(receipt.amountInCents / 100);
}

export function formatDonationDate(receipt: DonationReceipt) {
  return receipt.createdAt.toLocaleDateString(receipt.locale === "nl" ? "nl-NL" : "en-US");
}
