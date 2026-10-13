import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/convex-server";
import { getSiteUrl } from "@/lib/site-url";

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

const subscribeSchema = z.object({
  email: z.email(),
  locale: z.enum(["en", "nl"]),
  turnstileToken: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }

  const parsedSubscription = subscribeSchema.safeParse(body);

  if (!parsedSubscription.success) {
    return Response.json({ success: false }, { status: 400 });
  }

  const { email, locale, turnstileToken } = parsedSubscription.data;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!turnstileSecret) {
    console.error("Missing TURNSTILE_SECRET_KEY.");
    return Response.json({ success: false }, { status: 503 });
  }

  // Verify Turnstile BEFORE writing to Convex or sending email.
  const turnstileResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    },
  );

  const turnstile = (await turnstileResponse.json()) as TurnstileResponse;

  if (!turnstile.success) {
    return Response.json({ success: false }, { status: 403 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    await subscribeToNewsletter({ email: normalizedEmail, locale, siteUrl: getSiteUrl() });
  } catch (error) {
    console.error("Failed to store newsletter subscription.", error);
    return Response.json({ success: false }, { status: 500 });
  }

  return Response.json({ success: true });
}
