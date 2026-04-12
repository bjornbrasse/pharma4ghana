import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      amount?: unknown;
      locale?: unknown;
    };

    const amount = typeof body.amount === "number" ? body.amount : Number.NaN;
    const locale = body.locale === "nl" ? "nl" : "en";

    if (!Number.isFinite(amount) || amount < 5 || amount > 10000) {
      return NextResponse.json(
        { error: "Donation amount must be between 5 and 10,000 EUR." },
        { status: 400 },
      );
    }

    const stripe = getStripeClient();
    const unitAmount = Math.round(amount * 100);
    const origin = request.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      success_url: `${origin}/${locale}/donate?status=success`,
      cancel_url: `${origin}/${locale}/donate?status=cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            product_data: {
              name:
                locale === "nl"
                  ? "Donatie aan Pharma4Ghana"
                  : "Donation to Pharma4Ghana",
              description:
                locale === "nl"
                  ? "Een eenmalige bijdrage aan studiebeurzen, materialen en mentorschap in Ghana."
                  : "A one-time contribution to scholarships, study materials, and mentorship in Ghana.",
            },
          },
        },
      ],
      metadata: {
        amount_eur: amount.toFixed(2),
        locale,
        source: "donation-page",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error);

    return NextResponse.json(
      { error: "Unable to start Stripe checkout." },
      { status: 500 },
    );
  }
}
