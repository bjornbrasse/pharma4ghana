import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const ALLOWED_DONATION_AMOUNTS = [5, 10, 20, 30, 50] as const;
type DonationAmount = (typeof ALLOWED_DONATION_AMOUNTS)[number];

const DONATION_PRICE_ENV_BY_AMOUNT: Record<DonationAmount, string> = {
  5: "STRIPE_PRICE_DONATION_5_EUR",
  10: "STRIPE_PRICE_DONATION_10_EUR",
  20: "STRIPE_PRICE_DONATION_20_EUR",
  30: "STRIPE_PRICE_DONATION_30_EUR",
  50: "STRIPE_PRICE_DONATION_50_EUR",
};

function isDonationAmount(amount: number): amount is DonationAmount {
  return ALLOWED_DONATION_AMOUNTS.includes(amount as DonationAmount);
}

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
    const origin = request.nextUrl.origin;
    let lineItem:
      | { quantity: number; price: string }
      | {
          quantity: number;
          price_data: {
            currency: "eur";
            unit_amount: number;
            product_data: {
              name: string;
              description: string;
            };
          };
        };

    if (isDonationAmount(amount)) {
      const priceEnv = DONATION_PRICE_ENV_BY_AMOUNT[amount];
      const priceId = process.env[priceEnv];

      if (!priceId) {
        console.error(`Missing ${priceEnv} for donation amount ${amount} EUR.`);

        return NextResponse.json(
          { error: "Stripe donation prices are not configured correctly." },
          { status: 500 },
        );
      }

      lineItem = { quantity: 1, price: priceId };
    } else {
      lineItem = {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: locale === "nl" ? "Donatie aan Pharma4Ghana" : "Donation to Pharma4Ghana",
            description:
              locale === "nl"
                ? "Een eenmalige bijdrage aan studiebeurzen, materialen en mentorschap in Ghana."
                : "A one-time contribution to scholarships, study materials, and mentorship in Ghana.",
          },
        },
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      success_url: `${origin}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/donate?status=cancel`,
      line_items: [lineItem],
      metadata: {
        amount_eur: amount.toFixed(2),
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
        link: {display: "never"}
      }
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
