import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import DonateCtaBanner from "@/components/donate-cta-banner";
import {
  formatMessageDate,
  getLocalizedMessagePost,
  getLocalizedMessagePosts,
  getMessagePostSlugs,
  type AppLocale,
} from "@/data/messages";
import { Link } from "@/i18n/navigation";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

function getStableOrderValue(seed: string) {
  let hash = 0;

  for (const character of seed) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

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

  const url = getAbsoluteSiteUrl(`/${appLocale}/messages/${post.slug}`);
  const imageUrl = getAbsoluteSiteUrl(
    post.ogImage ?? `/images/og/messages/${post.slug}.jpg`,
  );
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
          url: imageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.synopsis,
      images: [imageUrl],
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
  const externalLinks = post?.externalLinks ?? (post?.externalLink ? [post.externalLink] : []);
  const relatedPosts = getLocalizedMessagePosts(appLocale)
    .filter((entry) => entry.slug !== slug)
    .map((entry) => ({
      entry,
      orderValue: getStableOrderValue(`${slug}:${locale}:${entry.slug}`),
    }))
    .sort((a, b) => a.orderValue - b.orderValue)
    .slice(0, 3)
    .map(({ entry }) => entry);

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

              {post.checklist?.length ? (
                <ul className="space-y-3 rounded-3xl bg-green-50 px-5 py-5 text-base text-gray-700 sm:text-lg">
                  {post.checklist.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="font-semibold text-ghana-green">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {post.supportList?.length ? (
                <ul className="space-y-2 pl-5 text-base leading-8 text-gray-700 sm:text-lg">
                  {post.supportList.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {externalLinks.length ? (
                <div className="flex flex-wrap gap-3 pt-1">
                  {externalLinks.map((link) => (
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

              {post.hashtags?.length ? (
                <div className="flex flex-wrap gap-3 pt-2">
                  {post.hashtags.map((hashtag) => (
                    <a
                      key={hashtag.label}
                      href={hashtag.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-ghana-green transition-colors hover:bg-green-100"
                    >
                      {hashtag.label}
                    </a>
                  ))}
                </div>
              ) : null}
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

      {relatedPosts.length ? (
        <section className="bg-ghana-green px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
                {t("related.eyebrow")}
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t("related.title")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-green-100">
                {t("related.subtitle")}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/messages/${relatedPost.slug}`}
                  locale={locale}
                  className="group block overflow-hidden rounded-4xl border border-green-800/50 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <article className="h-full">
                    <div className="relative aspect-4/3 w-full bg-gray-100">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>

                    <div className="flex h-full flex-col p-6">
                      <p className="mb-3 text-sm font-medium text-ghana-green">
                        {t("publishedOn")} {formatMessageDate(appLocale, relatedPost.publishedAt)}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-ghana-green">
                        {relatedPost.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                        {relatedPost.synopsis}
                      </p>
                      <span className="mt-5 inline-flex items-center text-sm font-semibold text-ghana-green">
                        {t("readMore")}
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}