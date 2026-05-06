import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { renderDonationReceiptPdf } from "@/lib/donation-receipt-pdf";

export const runtime = "nodejs";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(secretKey);
}

function formatAmount(amountInCents: number, locale: "en" | "nl") {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amountInCents / 100);
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const locale = request.nextUrl.searchParams.get("locale") === "nl" ? "nl" : "en";

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.mode !== "payment") {
      return NextResponse.json({ error: "Invalid receipt session." }, { status: 400 });
    }

    const createdAt = new Date(session.created * 1000);
    const amountTotal = session.amount_total ?? 0;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "-";
    const donorEmail = session.customer_details?.email ?? "-";

    const pdfBuffer = await renderDonationReceiptPdf({
      locale,
      sessionId: session.id,
      date: createdAt.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US"),
      amount: formatAmount(amountTotal, locale),
      paymentStatus: session.payment_status,
      paymentIntentId,
      donorEmail,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="donation-receipt-${session.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate donation receipt", error);

    return NextResponse.json({ error: "Unable to generate receipt." }, { status: 500 });
  }
}
