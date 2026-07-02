import { EarthIcon, HandshakeIcon, KeyRoundIcon, TabletsIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image.js";

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
    icon: <TabletsIcon />,
    accent: "text-ghana-green bg-ghana-green/10",
  },
  {
    key: "sustainability" as const,
    icon: <EarthIcon />,
    accent: "text-yellow-600 bg-ghana-gold/20",
  },
  {
    key: "accessibility" as const,
    icon: <KeyRoundIcon />,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    key: "partnership" as const,
    icon: <HandshakeIcon />,
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
          <h1 className="text-4xl sm:text-5xl font-bold text-green-100 mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-ghana-gold text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
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
              {/* <div key={"123"} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                 <Image width={24} height={24} src="../../../../public/barbara_photo.jpeg" alt="barbara_photo"/>
                </div>
              </div> */}
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
