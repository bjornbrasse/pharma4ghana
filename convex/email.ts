"use node";

import { v } from "convex/values";
import nodemailer from "nodemailer";
import { internalAction } from "./_generated/server";
import { getTransporter } from "./lib/email.js";

export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    // text: v.string(),
    html: v.string(),
  },
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
  },
});
