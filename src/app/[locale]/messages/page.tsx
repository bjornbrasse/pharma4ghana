import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DonateCtaBanner from "@/components/donate-cta-banner";
import {
  formatMessageDate,
  getLocalizedMessagePosts,
  type AppLocale,
} from "@/data/messages";
import { Link } from "@/i18n/navigation";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "messagesPage.meta" });
  const messagesUrl = getAbsoluteSiteUrl(`/${locale}/messages`);

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: messagesUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "messagesPage" });
  const appLocale: AppLocale = locale === "nl" ? "nl" : "en";
  const posts = getLocalizedMessagePosts(appLocale);

  return (
    <>
      <section className="bg-ghana-green px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="max-w-3xl">
            <p className="text-base leading-8 text-gray-600 sm:text-lg">
              {t("intro")}
            </p>
          </div>

          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/messages/${post.slug}`}
                locale={locale}
                className="group block overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <article className="grid gap-0 md:grid-cols-[220px_1fr]">
                  <div className="relative min-h-52 bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <p className="mb-3 text-sm font-medium text-ghana-green">
                      {t("publishedOn")} {formatMessageDate(appLocale, post.publishedAt)}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-ghana-green">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                      {post.synopsis}
                    </p>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-ghana-green">
                      {t("readMore")}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
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
