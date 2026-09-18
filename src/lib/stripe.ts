import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  const apiBase = process.env.STRIPE_API_BASE;
  const apiUrl = apiBase ? new URL(apiBase) : null;

  stripeClient ??= new Stripe(secretKey, {
    ...(apiUrl
      ? {
          host: apiUrl.hostname,
          port: apiUrl.port,
          protocol: apiUrl.protocol === "http:" ? ("http" as const) : ("https" as const),
        }
      : {}),
    maxNetworkRetries: apiUrl ? 0 : 1,
  });

  return stripeClient;
}
