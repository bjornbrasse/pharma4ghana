type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function POST(request: Request) {
  const { email, turnstileToken } = await request.json();

  if (typeof email !== "string" || typeof turnstileToken !== "string") {
    return Response.json({ success: false }, { status: 400 });
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
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    },
  );

  const turnstile = (await turnstileResponse.json()) as TurnstileResponse;

  if (!turnstile.success) {
    return Response.json({ success: false }, { status: 403 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // TODO:
  // 1. Validate email properly
  // 2. Check whether subscriber already exists
  // 3. Add/update pending subscription in Convex
  // 4. Send double-opt-in confirmation email

  return Response.json({ success: true });
}
