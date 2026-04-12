import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return { title: "Pharma4Ghana" };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ghana-green">
        {/* Decorative star watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-5 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-96 h-96 text-ghana-gold fill-current">
            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-ghana-gold text-sm font-semibold uppercase tracking-widest mb-4">
              {t("hero.preTitle")}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-green-100 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="px-6 py-3 rounded-lg bg-white text-ghana-green font-semibold hover:bg-green-50 transition-colors"
              >
                {t("hero.ctaLearnMore")}
              </Link>
              <Link
                href="/donate"
                className="px-6 py-3 rounded-lg bg-ghana-gold text-gray-900 font-semibold hover:bg-yellow-300 transition-colors"
              >
                {t("hero.ctaDonate")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────── */}
      <section className="bg-ghana-green-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-ghana-green-light">
            {[
              { value: t("stats.scholars"), label: t("stats.scholarsLabel") },
              { value: t("stats.years"), label: t("stats.yearsLabel") },
              { value: t("stats.partners"), label: t("stats.partnersLabel") },
            ].map((stat) => (
              <div key={stat.label} className="py-8 text-center">
                <p className="text-3xl sm:text-4xl font-bold text-ghana-gold mb-1">
                  {stat.value}
                </p>
                <p className="text-green-200 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-ghana-gold" />
            <span className="text-ghana-green text-sm font-semibold uppercase tracking-wider">
              {t("mission.title")}
            </span>
            <div className="w-8 h-0.5 bg-ghana-gold" />
          </div>
          <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
            {t("mission.body")}
          </p>
        </div>
      </section>

      {/* ── Impact cards ─────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("impact.title")}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t("impact.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scholarships */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-ghana-green/10 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-ghana-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("impact.scholarship.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t("impact.scholarship.body")}</p>
            </div>

            {/* Mentorship */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-ghana-gold/20 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("impact.mentorship.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t("impact.mentorship.body")}</p>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-ghana-red/10 flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-ghana-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("impact.resources.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">{t("impact.resources.body")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ghana-gold">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-gray-700 text-lg mb-8">{t("cta.body")}</p>
          <Link
            href="/donate"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-ghana-green text-white font-bold text-lg hover:bg-ghana-green-dark transition-colors shadow-lg"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
