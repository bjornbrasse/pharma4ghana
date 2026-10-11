"use server";

import { z } from "zod";
import { transporter } from "@/lib/email";
import { upsertContact } from "@/lib/convex-server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
};

type MailerError = Error & {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
};

const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email(),
  subject: z.string().trim().min(1).max(300),
  message: z.string().trim().min(1).max(10_000),
  locale: z.enum(["en", "nl"]),
});

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsedForm = contactFormSchema.safeParse({
    name: getTextField(formData, "name"),
    email: getTextField(formData, "email").toLowerCase(),
    subject: getTextField(formData, "subject"),
    message: getTextField(formData, "message"),
    locale: getTextField(formData, "locale"),
  });

  if (!parsedForm.success) {
    return { status: "error" };
  }

  const { name, email, subject, message, locale } = parsedForm.data;
  const from = process.env.CONTACT_FORM_FROM;
  const to = process.env.CONTACT_FORM_TO;

  console.info("[contact-form] Received submission", {
    hasName: Boolean(name),
    hasEmail: Boolean(email),
    hasSubject: Boolean(subject),
    messageLength: message.length,
    hasSmtpHost: Boolean(process.env.SMTP_HOST),
    hasSmtpUser: Boolean(process.env.SMTP_USER),
    hasSmtpPassword: Boolean(process.env.SMTP_PASSWORD),
    hasContactFormFrom: Boolean(process.env.CONTACT_FORM_FROM),
    hasContactFormTo: Boolean(process.env.CONTACT_FORM_TO),
  });

  if (!from) {
    console.error("[contact-form] Missing sender address", {
      hasContactFormFrom: Boolean(process.env.CONTACT_FORM_FROM),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
    });
    return { status: "error" };
  }

  try {
    await upsertContact({ email, name, locale });

    console.info("[contact-form] Attempting to send email", {
      from,
      to,
      replyTo: email,
      subject,
    });

    const result = await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    console.info("[contact-form] Email sent", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      pending: result.pending,
      response: result.response,
    });

    return { status: "success" };
  } catch (error) {
    const mailerError = error as MailerError;

    console.error("[contact-form] Failed to send email", {
      name: mailerError.name,
      message: mailerError.message,
      code: mailerError.code,
      command: mailerError.command,
      response: mailerError.response,
      responseCode: mailerError.responseCode,
      stack: mailerError.stack,
    });

    return { status: "error" };
  }
}