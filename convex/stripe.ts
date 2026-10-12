"use node";

import Stripe from "stripe";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const syncCustomer = internalAction({
  args: {
    customerId: v.string(),
  },

  handler: async (ctx, { customerId }) => {
    // External Stripe API call
    const customer = await stripe.customers.retrieve(customerId, {
      // expand: ["customer", "subscription"],
    });

    if (!customer) {
      throw new Error("Missing customer");
    }

    return customer;
  },
});

export const processCheckout = internalAction({
  args: {
    sessionId: v.string(),
  },

  handler: async (ctx, { sessionId }) => {
    // External Stripe API call
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    // Extract donor details
    const email = session.customer_details?.email;
    const name = session.customer_details?.name;

    if (!email) {
      throw new Error("Missing donor email");
    }

    // Save to Convex
    // await ctx.runMutation(internal.donations.saveCheckout, {
    //   sessionId: session.id,
    //   email,
    //   name: name ?? undefined,
    //   customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
    //   amount: session.amount_total ?? 0,
    //   currency: session.currency ?? "eur",
    // });
  },
});
