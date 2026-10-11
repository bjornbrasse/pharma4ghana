import "server-only";

import type Stripe from "stripe";
import {
  type ContactAddress,
  recordDonationRefund,
  recordPaidDonation,
  syncDonorSubscription,
} from "@/lib/convex-server";
import { getStripeClient } from "@/lib/stripe";

function getId(value: { id: string } | string | null) {
  return typeof value === "string" ? value : value?.id;
}

function getLocale(value: string | undefined) {
  return value === "nl" ? ("nl" as const) : ("en" as const);
}

function getAddress(address: Stripe.Address | null | undefined): ContactAddress | undefined {
  if (!address) {
    return undefined;
  }

  return {
    ...(address.line1 ? { line1: address.line1 } : {}),
    ...(address.line2 ? { line2: address.line2 } : {}),
    ...(address.city ? { city: address.city } : {}),
    ...(address.postal_code ? { postalCode: address.postal_code } : {}),
    ...(address.country ? { country: address.country } : {}),
  };
}

async function getCustomer(stripeCustomerId: string) {
  const customer = await getStripeClient().customers.retrieve(stripeCustomerId);

  if (customer.deleted || !customer.email) {
    throw new Error(`Stripe customer ${stripeCustomerId} has no usable email address.`);
  }

  return {
    email: customer.email,
    name: customer.name ?? undefined,
    address: getAddress(customer.address),
  };
}

async function getSubscription(stripeSubscriptionId: string) {
  return getStripeClient().subscriptions.retrieve(stripeSubscriptionId);
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const stripeCustomerId = getId(subscription.customer);

  if (!stripeCustomerId) {
    throw new Error(`Subscription ${subscription.id} has no Stripe customer.`);
  }

  const customer = await getCustomer(stripeCustomerId);
  const price = subscription.items.data[0]?.price;

  await syncDonorSubscription({
    stripeCustomerId,
    ...customer,
    locale: getLocale(subscription.metadata.locale),
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    purpose: subscription.metadata.purpose,
    amount: price?.unit_amount ?? undefined,
    currency: price?.currency,
  });
}

async function processCheckoutSession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  if (session.metadata?.source !== "donation-page") {
    return;
  }

  const stripeCustomerId = getId(session.customer);

  if (!stripeCustomerId) {
    throw new Error(`Checkout Session ${session.id} has no Stripe customer.`);
  }

  if (session.mode === "subscription") {
    const stripeSubscriptionId = getId(session.subscription);

    if (!stripeSubscriptionId) {
      throw new Error(`Checkout Session ${session.id} has no subscription.`);
    }

    await syncSubscription(await getSubscription(stripeSubscriptionId));
    return;
  }

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return;
  }

  const email = session.customer_details?.email;
  const amount = session.amount_total;
  const currency = session.currency;

  if (!email || amount === null || !currency) {
    throw new Error(`Paid Checkout Session ${session.id} is missing payment details.`);
  }

  await recordPaidDonation({
    stripeEventId: event.id,
    stripeCustomerId,
    email,
    name: session.customer_details?.name ?? undefined,
    address: getAddress(session.customer_details?.address),
    locale: getLocale(session.metadata.locale),
    stripePaymentIntentId: getId(session.payment_intent),
    stripeCheckoutSessionId: session.id,
    purpose: session.metadata.purpose ?? "custom",
    frequency: "once",
    amount,
    currency,
    paidAt: event.created * 1000,
  });
}

async function processPaidInvoice(event: Stripe.Event, invoice: Stripe.Invoice) {
  if (invoice.amount_paid <= 0) {
    return;
  }

  const stripeCustomerId = getId(invoice.customer);
  const subscriptionId = getId(invoice.parent?.subscription_details?.subscription ?? null);

  if (!stripeCustomerId || !subscriptionId) {
    return;
  }

  const [customer, subscription, expandedInvoice] = await Promise.all([
    getCustomer(stripeCustomerId),
    getSubscription(subscriptionId),
    getStripeClient().invoices.retrieve(invoice.id, {
      expand: ["payments.data.payment.payment_intent"],
    }),
  ]);
  const invoicePayment = expandedInvoice.payments?.data.find(
    (payment) => payment.status === "paid",
  );
  const paymentIntentId = getId(invoicePayment?.payment.payment_intent ?? null);

  await recordPaidDonation({
    stripeEventId: event.id,
    stripeCustomerId,
    ...customer,
    locale: getLocale(subscription.metadata.locale),
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    stripePaymentIntentId: paymentIntentId,
    stripeInvoiceId: invoice.id,
    purpose:
      invoice.parent?.subscription_details?.metadata?.purpose ??
      subscription.metadata.purpose ??
      "custom",
    frequency: "monthly",
    amount: invoice.amount_paid,
    currency: invoice.currency,
    paidAt: (invoice.status_transitions.paid_at ?? event.created) * 1000,
  });
}

async function processRefund(refund: Stripe.Refund) {
  if (refund.status !== "succeeded") {
    return;
  }

  const chargeId = getId(refund.charge);

  if (!chargeId) {
    return;
  }

  const charge = await getStripeClient().charges.retrieve(chargeId);
  const paymentIntentId = getId(charge.payment_intent);

  if (!paymentIntentId) {
    return;
  }

  await recordDonationRefund({
    stripePaymentIntentId: paymentIntentId,
    refundedAmount: charge.amount_refunded,
  });
}

export async function processStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await processCheckoutSession(event, event.data.object);
      break;
    case "invoice.paid":
      await processPaidInvoice(event, event.data.object);
      break;
    case "invoice.payment_failed": {
      const subscriptionId = getId(
        event.data.object.parent?.subscription_details?.subscription ?? null,
      );

      if (subscriptionId) {
        await syncSubscription(await getSubscription(subscriptionId));
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object);
      break;
    case "refund.created":
      await processRefund(event.data.object);
      break;
    default:
      break;
  }
}
