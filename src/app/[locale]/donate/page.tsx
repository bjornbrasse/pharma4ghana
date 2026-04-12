import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import DonateForm from "@/components/donate-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate.meta" });

  return { title: t("title") };
}

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "donate" });
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <>
      <section className="bg-ghana-green py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ghana-gold text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Stripe Checkout
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {status === "success" ? (
            <div className="rounded-2xl border border-ghana-green/20 bg-ghana-green/5 px-6 py-5 text-ghana-green">
              <p className="text-lg font-bold mb-1">{t("status.successTitle")}</p>
              <p className="text-sm leading-relaxed">{t("status.successBody")}</p>
            </div>
          ) : null}

          {status === "cancel" ? (
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 px-6 py-5 text-yellow-900">
              <p className="text-lg font-bold mb-1">{t("status.cancelTitle")}</p>
              <p className="text-sm leading-relaxed">{t("status.cancelBody")}</p>
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {t("panel.title")}
                </h2>
                <p className="text-gray-600 leading-relaxed">{t("panel.subtitle")}</p>
              </div>

              <DonateForm locale={locale} enabled={stripeEnabled} />
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-5">{t("impact.title")}</h2>
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

              <div className="rounded-[2rem] bg-ghana-gold p-8 text-gray-900 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{t("trust.title")}</h2>
                <p className="text-sm leading-relaxed mb-3">{t("trust.body")}</p>
                <p className="text-sm leading-relaxed text-gray-700">{t("trust.methods")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
