import { NextRequest, NextResponse } from "next/server";
import { donationSchema } from "@/lib/donation-schema";
import { paymentFunctionAvailable } from "@/lib/payment-config";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

function invalidDonationResponse() {
  return NextResponse.json(
    { error: "Invalid donation. Amount must be a whole number between 5 and 1,000 EUR." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" || !paymentFunctionAvailable) {
    return NextResponse.json({ error: "Donations are temporarily unavailable." }, { status: 503 });
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return invalidDonationResponse();
    }

    const parsedDonation = donationSchema.safeParse(body);

    if (!parsedDonation.success) {
      return invalidDonationResponse();
    }

    const { amount, frequency, locale } = parsedDonation.data;
    const stripe = getStripeClient();
    const origin = request.nextUrl.origin;
    const recurring = frequency === "monthly";
    const productName =
      locale === "nl"
        ? recurring
          ? "Maandelijkse steun aan Pharma4Ghana"
          : "Donatie aan Pharma4Ghana"
        : recurring
          ? "Monthly support for Pharma4Ghana"
          : "Donation to Pharma4Ghana";

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      ...(!recurring
        ? { submit_type: "donate" as const, customer_creation: "always" as const }
        : {}),
      billing_address_collection: "required",
      success_url: `${origin}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/donate?status=cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: productName,
              description:
                locale === "nl"
                  ? "Steun voor farmaceutisch onderwijs, leermiddelen en mentorschap in Ghana."
                  : "Support for pharmacy education, learning materials, and mentorship in Ghana.",
            },
            ...(recurring ? { recurring: { interval: "month" as const } } : {}),
          },
        },
      ],
      metadata: {
        amount_eur: amount.toFixed(2),
        frequency,
        locale,
        source: "donation-page",
      },
      payment_method_types: ["ideal", "card"],
      custom_text: {
        // terms_of_service_acceptance: {
        //   message: "Door te doneren ga je akkoord met onze algemene voorwaarden."},
        // submit: {
        //   message: 'Gebruik bij voorkeur iDEAL ivm. lagere transactiekosten.',
        // },
      },
      wallet_options: {
        link: { display: "never" },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session", error);

    return NextResponse.json({ error: "Unable to start Stripe checkout." }, { status: 500 });
  }
}
