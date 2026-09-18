import { NextRequest, NextResponse } from "next/server";
import { renderDonationReceiptPdf } from "@/lib/donation-receipt-pdf";
import {
  DonationReceiptError,
  getDonationReceipt,
  type DonationLocale,
} from "@/lib/donation-receipt";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const locale: DonationLocale =
      request.nextUrl.searchParams.get("locale") === "nl" ? "nl" : "en";

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
    }

    const receipt = await getDonationReceipt(sessionId, locale);
    const pdfBuffer = await renderDonationReceiptPdf(receipt);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="donation-receipt-${receipt.receiptNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate donation receipt", error);

    if (error instanceof DonationReceiptError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unable to generate receipt." }, { status: 500 });
  }
}
