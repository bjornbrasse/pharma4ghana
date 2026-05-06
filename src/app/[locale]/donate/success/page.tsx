import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate.successMeta" });

  return { title: t("title") };
}

export default async function DonateSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id: sessionId } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "donate" });
  const receiptDownloadUrl = sessionId
    ? `/api/donations/receipt?session_id=${encodeURIComponent(sessionId)}&locale=${locale}`
    : null;

  return (
    <>
      <section className="bg-ghana-green py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ghana-gold text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            {t("successPage.eyebrow")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("successPage.title")}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("successPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-4xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ghana-green/10 text-ghana-green mb-6">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {t("successPage.messageTitle")}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              {t("successPage.messageBody")}
            </p>

            <div className="mb-8 rounded-2xl border border-ghana-green/20 bg-ghana-green/5 p-5">
              <p className="text-sm font-semibold text-ghana-green mb-3">
                {t("successPage.receiptLabel")}
              </p>
              {receiptDownloadUrl ? (
                <a
                  href={receiptDownloadUrl}
                  className="inline-flex items-center justify-center rounded-xl bg-ghana-gold px-5 py-3 text-sm font-bold text-ghana-green transition-colors hover:bg-ghana-gold-dark"
                >
                  {t("successPage.actions.receipt")}
                </a>
              ) : (
                <p className="text-sm text-ghana-green">{t("successPage.receiptUnavailable")}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-ghana-green px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-ghana-green-dark"
              >
                {t("successPage.actions.home")}
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 transition-colors hover:border-ghana-green hover:text-ghana-green"
              >
                {t("successPage.actions.donate")}
              </Link>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              {t("successPage.impactTitle")}
            </h2>
            <div className="space-y-4">
              {([
                "scholarships",
                "materials",
                "mentorship",
              ] as const).map((key) => (
                <div key={key} className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {t(`impact.items.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {t(`impact.items.${key}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}