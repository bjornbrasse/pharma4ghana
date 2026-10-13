import { z } from "zod";
import { confirmNewsletterSubscription } from "@/lib/convex-server";

const tokenSchema = z.string().min(32).max(256);

function htmlResponse(title: string, message: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body><main><h1>${title}</h1><p>${message}</p><p><a href="/">Return to Pharma4Ghana</a></p></main></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function GET(request: Request) {
  const token = tokenSchema.safeParse(new URL(request.url).searchParams.get("token"));

  if (!token.success) {
    return htmlResponse("Invalid confirmation link", "This confirmation link is not valid.", 400);
  }

  try {
    const result = await confirmNewsletterSubscription(token.data);

    if (result === "confirmed") {
      return htmlResponse(
        "Subscription confirmed",
        "You are now subscribed to the Pharma4Ghana newsletter.",
      );
    }

    if (result === "expired") {
      return htmlResponse(
        "Confirmation link expired",
        "Please submit the newsletter form again to receive a new link.",
        410,
      );
    }

    return htmlResponse(
      "Invalid confirmation link",
      "This link has already been used or is invalid.",
      400,
    );
  } catch (error) {
    console.error("Failed to confirm newsletter subscription.", error);
    return htmlResponse("Unable to confirm", "Please try again later.", 500);
  }
}
