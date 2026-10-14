"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Link } from "@/i18n/navigation";
import { Markdown } from "@/components/markdown";
import {
  formatConvexMessageDate,
  getLinkedInHashtagUrl,
  parseConvexMessage,
} from "@/lib/convex-messages";
import { Pencil } from "lucide-react";

export default function ConvexMessagePost({
  locale,
  messageId,
  canEdit,
}: {
  locale: string;
  messageId: Id<"message">;
  canEdit: boolean;
}) {
  const message = useQuery(api.message.get, { messageId });
  const t = useTranslations("messagesPage");

  if (message === undefined) {
    return <p className="py-20 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (message === null) {
    return <p className="py-20 text-center text-sm text-gray-500">Message not found.</p>;
  }

  const localized = parseConvexMessage(locale === "nl" ? message.contentNl : message.contentEn);

  return (
    <>
      <section className="bg-ghana-green px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href="/messages2"
              locale={locale}
              className="inline-flex items-center text-sm font-medium text-ghana-gold hover:text-yellow-200"
            >
              {t("back")}
            </Link>
            {canEdit ? (
              <Link
                href={`/messages2/${messageId}/edit`}
                locale={locale}
                className="inline-flex items-center gap-2 rounded-md border border-ghana-gold px-3 py-2 text-sm font-semibold text-ghana-gold hover:bg-ghana-gold hover:text-ghana-green-dark"
              >
                <Pencil aria-hidden="true" className="size-4" />
                {locale === "nl" ? "Bewerken" : "Edit"}
              </Link>
            ) : null}
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("publishedOn")}{" "}
            {formatConvexMessageDate(locale, message.publishedAt ?? message._creationTime)}
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {localized.title || message.title}
          </h1>
          {localized.author ? (
            <p className="mt-4 text-xl leading-7 text-green-400">{localized.author}</p>
          ) : null}
          {localized.synopsis ? (
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-green-100 sm:text-xl">
              {localized.synopsis}
            </p>
          ) : null}
        </div>
      </section>
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">
            {message.imageUrl ? (
              <div className="relative aspect-video w-full bg-gray-100">
                <Image
                  src={message.imageUrl}
                  alt={message.imageAlt ?? ""}
                  fill
                  className={`object-cover ${message.imageClasses ?? ""}`}
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            ) : null}
            <article className="space-y-6 px-6 py-8 sm:px-10 sm:py-10">
              <Markdown>{localized.content}</Markdown>
              {message.externalLinks?.length ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {message.externalLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      className="inline-flex items-center rounded-full border border-green-200 px-4 py-2 text-sm font-medium text-ghana-green transition-colors hover:border-green-300 hover:bg-green-50"
                    >
                      {link.href.startsWith("mailto:") ? <span className="mr-2">📩</span> : null}
                      {link.href.startsWith("http://") || link.href.startsWith("https://") ? (
                        <span className="mr-2">🌍</span>
                      ) : null}
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}

              {message.hashtags?.length ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  {message.hashtags.map((hashtag) => (
                    <a
                      key={hashtag}
                      href={getLinkedInHashtagUrl(hashtag)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-ghana-green transition-colors hover:bg-green-100"
                    >
                      {hashtag}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
