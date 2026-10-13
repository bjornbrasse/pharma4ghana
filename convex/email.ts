"use node";

import { v } from "convex/values";
import nodemailer from "nodemailer";
import { action, internalAction } from "./_generated/server";
import { assertSyncSecret } from "./auth";
import { getTransporter } from "./lib/email.js";
import {
  renderMonthlyDonationPdf,
  renderOneTimeDonationPdf,
  renderSuccessPageDonationPdf,
} from "./lib/email/donation_pdfs.js";
import { renderDonationReceiptEmail } from "./lib/email/donation_receipt_email.js";

type DonationReceiptArgs = {
  email: string;
  name?: string;
  locale: "en" | "nl";
  frequency: "monthly" | "once";
  amount: number;
  currency: string;
  paidAt: number;
  paymentReference: string;
  subscriptionReference?: string;
  pdfFormat?: "classic" | "successPage";
};

async function sendDonationReceiptEmail(args: DonationReceiptArgs, receiptNumber: string) {
  const pdfInput = {
    locale: args.locale,
    receiptNumber,
    paidAt: args.paidAt,
    amount: args.amount,
    currency: args.currency,
    paymentReference: args.paymentReference,
    donorName: args.name,
    donorEmail: args.email,
    subscriptionReference: args.subscriptionReference,
  };
  const pdf =
    args.pdfFormat === "successPage"
      ? await renderSuccessPageDonationPdf(pdfInput, args.frequency)
      : args.frequency === "monthly"
        ? await renderMonthlyDonationPdf(pdfInput)
        : await renderOneTimeDonationPdf(pdfInput);
  const dutch = args.locale === "nl";
  const html = await renderDonationReceiptEmail({
    locale: args.locale,
    donorName: args.name,
    frequency: args.frequency,
    amount: args.amount,
    currency: args.currency,
    paidAt: args.paidAt,
    receiptNumber,
  });
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER ?? "Pharma4Ghana <donations@pharma4ghana.com>",
    to: args.email,
    subject: dutch ? "Uw donatiebewijs van Pharma4Ghana" : "Your Pharma4Ghana donation receipt",
    text: dutch
      ? "Hartelijk dank voor uw donatie. Uw donatiebewijs vindt u in de bijlage."
      : "Thank you for your donation. Your donation receipt is attached.",
    html,
    attachments: [
      {
        filename: `${receiptNumber}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });

  console.log("Donation receipt sent:", info.response);
  console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    // text: v.string(),
    html: v.string(),
  },
  returns: v.null(),
  handler: async (_ctx, { subject, html, to }) => {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      // text,
      html,
    });

    console.log("Email sent:", info.response);
    console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
    return null;
  },
});

export const sendDonationReceipt = internalAction({
  args: {
    donationId: v.id("donation"),
    email: v.string(),
    name: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    frequency: v.union(v.literal("monthly"), v.literal("once")),
    amount: v.number(),
    currency: v.string(),
    paidAt: v.number(),
    paymentReference: v.string(),
    subscriptionReference: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (_ctx, args) => {
    const year = new Date(args.paidAt).getUTCFullYear();
    const receiptNumber = `P4G-${year}-${args.frequency === "monthly" ? "MD" : "EX"}-${args.donationId.slice(-6).toUpperCase()}`;
    await sendDonationReceiptEmail(args, receiptNumber);
    return null;
  },
});

const testReceiptArgs = {
  syncSecret: v.string(),
  to: v.string(),
  name: v.optional(v.string()),
  locale: v.union(v.literal("en"), v.literal("nl")),
  pdfFormat: v.union(v.literal("classic"), v.literal("successPage")),
  amount: v.optional(v.number()),
  currency: v.optional(v.string()),
};

export const testDonationReceipt = action({
  args: testReceiptArgs,
  returns: v.string(),
  handler: async (_ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const paidAt = Date.now();
    const receiptNumber = `P4G-${new Date(paidAt).getUTCFullYear()}-EX-TEST`;
    await sendDonationReceiptEmail(
      {
        email: args.to,
        name: args.name,
        locale: args.locale,
        pdfFormat: args.pdfFormat,
        frequency: "once",
        amount: args.amount ?? 2500,
        currency: args.currency ?? "eur",
        paidAt,
        paymentReference: "test_payment",
      },
      receiptNumber,
    );
    return receiptNumber;
  },
});

export const testSubscriptionReceipt = action({
  args: testReceiptArgs,
  returns: v.string(),
  handler: async (_ctx, args) => {
    assertSyncSecret(args.syncSecret);

    const paidAt = Date.now();
    const receiptNumber = `P4G-${new Date(paidAt).getUTCFullYear()}-MD-TEST`;
    await sendDonationReceiptEmail(
      {
        email: args.to,
        name: args.name,
        locale: args.locale,
        pdfFormat: args.pdfFormat,
        frequency: "monthly",
        amount: args.amount ?? 2500,
        currency: args.currency ?? "eur",
        paidAt,
        paymentReference: "test_invoice",
        subscriptionReference: "test_subscription",
      },
      receiptNumber,
    );
    return receiptNumber;
  },
});
