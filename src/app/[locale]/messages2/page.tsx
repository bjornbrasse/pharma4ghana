import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ConvexMessagesList from "@/components/convex-messages-list";
import DonateCtaBanner from "@/components/donate-cta-banner";
import { Link } from "@/i18n/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = { title: "Messages" };

export default async function Messages2Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "messagesPage" });
  const showNewButton = await isAuthenticated();

  return (
    <>
      <section className="bg-ghana-green px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">{t("hero.title")}</h1>
          <p className="mx-auto max-w-2xl text-md leading-relaxed text-green-100 sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>
      <section className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base leading-8 text-gray-600 sm:text-lg">{t("intro")}</p>
            {showNewButton ? (
              <Link
                href="/messages/new"
                locale={locale}
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark"
              >
                <Plus aria-hidden="true" className="size-4" /> {t("new")}
              </Link>
            ) : null}
          </div>
          <ConvexMessagesList locale={locale} />
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
