"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { api } from "@convex/_generated/api";
import { Link } from "@/i18n/navigation";
import { formatConvexMessageDate, parseConvexMessage } from "@/lib/convex-messages";

export default function ConvexMessagesList({ locale }: { locale: string }) {
  const messages = useQuery(api.message.list);
  const t = useTranslations("messagesPage");

  if (messages === undefined) {
    return <p className="py-10 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
        {locale === "nl" ? "Er zijn nog geen berichten." : "There are no messages yet."}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {messages.map((message) => {
        const localized = parseConvexMessage(
          locale === "nl" ? message.contentNl : message.contentEn,
        );

        return (
          <Link
            key={message._id}
            href={`/messages2/${message._id}`}
            locale={locale}
            className="group block overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <article className="grid gap-0 md:grid-cols-[220px_1fr]">
              <div className="relative min-h-52 bg-gray-100">
                {message.imageUrl ? (
                  <Image
                    src={message.imageUrl}
                    alt={message.imageAlt ?? ""}
                    fill
                    className={`object-cover ${message.imageClasses ?? ""}`}
                    sizes="(max-width: 768px) 100vw, 220px"
                  />
                ) : null}
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="mb-3 text-sm font-medium text-ghana-green">
                  {t("publishedOn")}{" "}
                  {formatConvexMessageDate(locale, message.publishedAt ?? message._creationTime)}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-ghana-green">
                  {localized.title || message.title}
                </h2>
                {localized.author ? (
                  <p className="text-sm leading-7 text-ghana-green/50 sm:text-base">
                    {localized.author}
                  </p>
                ) : null}
                {localized.synopsis ? (
                  <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                    {localized.synopsis}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-ghana-green">
                  {t("readMore")}
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
