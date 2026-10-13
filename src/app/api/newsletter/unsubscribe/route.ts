import { z } from "zod";
import { unsubscribeFromNewsletter } from "@/lib/convex-server";

const tokenSchema = z.string().regex(/^[A-Za-z0-9._-]{32,512}$/);

function htmlResponse(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter subscription</title></head><body><main>${body}</main></body></html>`,
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
    return htmlResponse("<h1>Invalid unsubscribe link</h1><p>This link is not valid.</p>", 400);
  }

  return htmlResponse(
    `<h1>Unsubscribe from the newsletter?</h1><form method="post"><input type="hidden" name="token" value="${token.data}"><button type="submit">Unsubscribe</button></form>`,
  );
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  let rawToken = requestUrl.searchParams.get("token");

  if (!rawToken) {
    try {
      const formData = await request.formData();
      rawToken = formData.get("token")?.toString() ?? null;
    } catch {
      rawToken = null;
    }
  }

  const token = tokenSchema.safeParse(rawToken);

  if (!token.success) {
    return htmlResponse("<h1>Invalid unsubscribe link</h1><p>This link is not valid.</p>", 400);
  }

  try {
    const result = await unsubscribeFromNewsletter(token.data);

    if (result === "invalid") {
      return htmlResponse("<h1>Invalid unsubscribe link</h1><p>This link is not valid.</p>", 400);
    }

    return htmlResponse(
      '<h1>Unsubscribed</h1><p>You will no longer receive the Pharma4Ghana newsletter.</p><p><a href="/">Return to Pharma4Ghana</a></p>',
    );
  } catch (error) {
    console.error("Failed to unsubscribe from newsletter.", error);
    return htmlResponse("<h1>Unable to unsubscribe</h1><p>Please try again later.</p>", 500);
  }
}
