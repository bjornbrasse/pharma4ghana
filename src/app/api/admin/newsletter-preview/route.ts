import { z } from "zod";
import { renderNewsletterEmail } from "@/emails/newsletter";
import { isAuthenticated } from "@/lib/auth-server";

export const runtime = "nodejs";

const previewSchema = z.object({
  locale: z.enum(["nl", "en"]),
  markdown: z.string().min(1).max(250_000),
});

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const input = previewSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ error: "Invalid newsletter content" }, { status: 400 });
  }

  try {
    return Response.json(await renderNewsletterEmail(input.data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not render newsletter";
    return Response.json({ error: message }, { status: 400 });
  }
}
