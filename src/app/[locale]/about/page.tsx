import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.hero" });
  return { title: t("title") };
}

const teamMembers = [
  { key: "barbara" as const, initial: "BM", color: "bg-ghana-green" },
  { key: "hans" as const, initial: "HR", color: "bg-ghana-green-dark" },
  { key: "trea" as const, initial: "TK", color: "bg-ghana-green-light" },
  { key: "bjorn" as const, initial: "BB", color: "bg-ghana-green" },
];

const values = [
  {
    key: "education" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z"
        />
      </svg>
    ),
    accent: "text-ghana-green bg-ghana-green/10",
  },
  {
    key: "community" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    accent: "text-yellow-600 bg-ghana-gold/20",
  },
  {
    key: "integrity" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    accent: "text-blue-600 bg-blue-50",
  },
  {
    key: "excellence" as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    accent: "text-ghana-red bg-ghana-red/10",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-ghana-green py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-ghana-gold" />
                <span className="text-ghana-green text-sm font-semibold uppercase tracking-wider">
                  {t("story.title")}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {t("story.title")}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t("story.para1")}</p>
              <p className="text-gray-600 leading-relaxed">{t("story.para2")}</p>
            </div>

            {/* Visual: Ghana flag-inspired graphic */}
            <div className="relative hidden lg:block">
              <div className="rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-ghana-green via-ghana-gold to-ghana-red flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-32 h-32 mx-auto opacity-40 fill-current text-white"
                  >
                    <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                  </svg>
                  <p className="text-4xl font-bold mt-4 drop-shadow">Ghana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map(({ key, icon, accent }) => (
              <div
                key={key}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${accent}`}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(`values.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("team.title")}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t("team.subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {teamMembers.map(({ key, initial, color }) => (
              <div key={key} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full ${color} flex items-center justify-center mx-auto mb-4`}
                >
                  <span className="text-white font-bold text-lg">{initial}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {t(`team.members.${key}.name`)}
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  {t(`team.members.${key}.role`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
