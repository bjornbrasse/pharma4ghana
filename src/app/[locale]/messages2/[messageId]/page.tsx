import { ConvexHttpClient } from "convex/browser";
import type { Metadata } from "next";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import ConvexMessagePost from "@/components/convex-message-post";
import { isAuthenticated } from "@/lib/auth-server";
import { parseConvexMessage } from "@/lib/convex-messages";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; messageId: string }>;
}): Promise<Metadata> {
  const { locale, messageId } = await params;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return {};

  try {
    const client = new ConvexHttpClient(url);
    const message = await client.query(api.message.get, {
      messageId: messageId as Id<"message">,
    });
    if (!message) return {};

    const localized = parseConvexMessage(locale === "nl" ? message.contentNl : message.contentEn);
    const title = localized.title || message.title;
    const pageUrl = getAbsoluteSiteUrl(`/${locale}/messages2/${messageId}`);

    return {
      title,
      description: localized.synopsis || undefined,
      openGraph: {
        title,
        description: localized.synopsis || undefined,
        type: "article",
        url: pageUrl,
        images: message.ogImageUrl
          ? [{ url: message.ogImageUrl, alt: message.imageAlt ?? "" }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: localized.synopsis || undefined,
        images: message.ogImageUrl ? [message.ogImageUrl] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function Message2Page({
  params,
}: {
  params: Promise<{ locale: string; messageId: string }>;
}) {
  const { locale, messageId } = await params;
  const canEdit = await isAuthenticated();
  return (
    <ConvexMessagePost locale={locale} messageId={messageId as Id<"message">} canEdit={canEdit} />
  );
}
