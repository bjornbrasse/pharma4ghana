import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { processStripeEvent } from "@/lib/stripe-events";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return new NextResponse("Missing Stripe signature.", { status: 400 });
  }

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET.");
    return new NextResponse("Webhook is not configured.", { status: 503 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripeClient().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.warn("Rejected Stripe webhook signature.", error);
    return new NextResponse("Invalid Stripe signature.", { status: 400 });
  }

  try {
    await processStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Failed to process Stripe webhook.", error);
    return new NextResponse("Webhook processing failed.", { status: 500 });
  }
}
