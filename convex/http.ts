import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

const http = httpRouter();

http.route({
  path: "/stripe/webhook",
  method: "POST",

  handler: httpAction(async (ctx, request) => {
    console.log("🚀 ~ stripe:");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing signature", {
        status: 400,
      });
    }

    const payload = await request.text();

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error("Stripe webhook signature verification failed", err);
      return new Response("Invalid signature", {
        status: 400,
      });
    }

    try {
      await ctx.runAction(internal.stripeEventAction.processEvent, {
        eventId: event.id,
        payload: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Stripe webhook failed", error);

      return new Response("Processing failed", {
        status: 500,
      });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
