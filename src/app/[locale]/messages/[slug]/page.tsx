import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import DonateCtaBanner from "@/components/donate-cta-banner";
import {
  formatMessageDate,
  getLocalizedMessagePost,
  getMessagePostSlugs,
  type AppLocale,
} from "@/data/messages";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return getMessagePostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const appLocale = locale === "nl" ? "nl" : "en";
  const post = getLocalizedMessagePost(slug, appLocale);

  if (!post) {
    return {};
  }

  const url = `/${appLocale}/messages/${post.slug}`;

  return {
    title: post.title,
    description: post.synopsis,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.synopsis,
      type: "article",
      url,
      images: [
        {
          url: post.image,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.synopsis,
      images: [post.image],
    },
  };
}

export default async function MessagePostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const appLocale: AppLocale = locale === "nl" ? "nl" : "en";
  const t = await getTranslations({ locale, namespace: "messagesPage" });
  const post = getLocalizedMessagePost(slug, appLocale);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="bg-ghana-green px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/messages"
            locale={locale}
            className="mb-6 inline-flex items-center text-sm font-medium text-ghana-gold hover:text-yellow-200"
          >
            {t("back")}
          </Link>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("publishedOn")} {formatMessageDate(appLocale, post.publishedAt)}
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-green-100 sm:text-xl">
            {post.synopsis}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm">
            <div className="relative aspect-video w-full bg-gray-100">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>

            <article className="space-y-6 px-6 py-8 sm:px-10 sm:py-10">
              {post.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-gray-700 sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </article>
          </div>

          <DonateCtaBanner
            locale={locale}
            title={t("donateBanner.title")}
            body={t("donateBanner.body")}
            ctaLabel={t("donateBanner.button")}
          />
        </div>
      </section>
    </>
  );
}