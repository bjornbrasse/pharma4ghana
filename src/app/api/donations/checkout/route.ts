import { NextRequest, NextResponse } from "next/server";
import { prepareDonationCheckout, subscribeToNewsletter } from "@/lib/convex-server";
import { donationOptions } from "@/lib/donation-options";
import { donationCheckoutSchema } from "@/lib/donation-schema";
import { paymentFunctionAvailable } from "@/lib/payment-config";
import { getSiteUrl } from "@/lib/site-url";
import { getStripeClient } from "@/lib/stripe";

export const runtime = "nodejs";

function invalidDonationResponse() {
  return NextResponse.json(
    { error: "Invalid donation. Amount must be a whole number between 5 and 1,000 EUR." },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  if (!paymentFunctionAvailable) {
    return NextResponse.json({ error: "Donations are temporarily unavailable." }, { status: 503 });
  }

  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return invalidDonationResponse();
    }

    const parsedDonation = donationCheckoutSchema.safeParse(body);

    if (!parsedDonation.success) {
      return invalidDonationResponse();
    }

    const { amount, frequency, locale, purpose, donorName, donorEmail, newsletterOptIn } =
      parsedDonation.data;
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
    const newsletterMetadata = newsletterOptIn ? "true" : "false";

    await prepareDonationCheckout({
      email: donorEmail,
      name: donorName,
      locale,
      newsletterOptIn,
    });

    if (newsletterOptIn) {
      try {
        await subscribeToNewsletter({ email: donorEmail, locale, siteUrl: getSiteUrl() });
      } catch (error) {
        console.error("Failed to send donation newsletter confirmation.", error);
      }
    }

    const customer = await stripe.customers.create({
      name: donorName,
      email: donorEmail,
      metadata: {
        newsletter_opt_in: newsletterMetadata,
        source: "donation-page",
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      ...(!recurring ? { submit_type: "donate" as const } : {}),
      customer: customer.id,
      customer_update: {
        address: "auto",
        name: "auto",
      },
      billing_address_collection: "required",
      success_url: `${origin}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/donate?status=cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(amount * 100),
            ...(recurring
              ? { product: donationOptions[purpose].stripeProductId }
              : {
                  product_data: {
                    name: productName,
                    description:
                      locale === "nl"
                        ? "Steun voor farmaceutisch onderwijs, leermiddelen en mentorschap in Ghana."
                        : "Support for pharmacy education, learning materials, and mentorship in Ghana.",
                  },
                }),
            ...(recurring ? { recurring: { interval: "month" as const } } : {}),
          },
        },
      ],
      metadata: {
        amount_eur: amount.toFixed(2),
        frequency,
        locale,
        newsletter_opt_in: newsletterMetadata,
        purpose,
        source: "donation-page",
      },
      ...(recurring
        ? {
            subscription_data: {
              metadata: {
                locale,
                newsletter_opt_in: newsletterMetadata,
                purpose,
                source: "donation-page",
              },
            },
          }
        : {}),
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
