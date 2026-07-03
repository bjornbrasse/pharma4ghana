"use server";

import { transporter } from "@/lib/email";

export type ContactFormState = {
  status: "idle" | "success" | "error";
};

type MailerError = Error & {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
};

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getTextField(formData, "name");
  const email = getTextField(formData, "email");
  const subject = getTextField(formData, "subject");
  const message = getTextField(formData, "message");

  if (!name || !email || !subject || !message) {
    return { status: "error" };
  }

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