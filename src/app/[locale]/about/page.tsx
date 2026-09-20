import { ArrowDownToLine, EarthIcon, HandshakeIcon, KeyRoundIcon, TabletsIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image.js";
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
  {
    key: "barbara" as const,
    initial: "BM",
    color: "bg-ghana-green",
    image: "/images/members/barbara_avatar.jpg",
  },
  {
    key: "hans" as const,
    initial: "HR",
    color: "bg-ghana-green-dark",
    image: "/images/members/hans_avatar.jpg",
  },
  {
    key: "trea" as const,
    initial: "TK",
    color: "bg-ghana-green-light",
    image: "/images/members/trea_avatar.jpg",
  },
  {
    key: "bjorn" as const,
    initial: "BB",
    color: "bg-ghana-green",
    image: "/images/members/bjorn_avatar.jpg",
  },
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

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-ghana-green py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-100 mb-6">{t("hero.title")}</h1>
          <p className="text-ghana-gold text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Our Story ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
              <div className="rounded-2xl overflow-hidden h-80 bg-linear-to-br from-ghana-green via-ghana-gold to-ghana-red flex items-center justify-center">
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

      {/* ── Team ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t("team.title")}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t("team.subtitle")}</p>
          </div>

          <div className="mx-auto grid max-w-56 grid-cols-1 gap-8 sm:max-w-none sm:grid-cols-4 sm:gap-6">
            {teamMembers.map(({ key, image }) => (
              <div key={key} className="flex items-center gap-4 sm:flex-col sm:gap-0">
                <div className="size-24 shrink-0 rounded-full flex items-center justify-center overflow-hidden border-3 border-gray-300 shadow sm:mx-auto sm:mb-4">
                  <Image
                    width={200}
                    height={200}
                    src={image}
                    alt={t(`team.members.${key}.name`)}
                    className="object-fill"
                  />
                </div>
                <div className="flex min-w-0 flex-col text-left">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {t(`team.members.${key}.name`)}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">{t(`team.members.${key}.role`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
            {values.map(({ key, icon, accent }) => (
              <div
                key={key}
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${accent} border border-gray-200`}
                >
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`values.${key}.title`)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(`values.${key}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Governance ─────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-xs sm:max-w-3xl mx-auto flex flex-col gap-6 text-center">
          <div className="mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("governance.title")}
            </h2>
          </div>
          <p className="text-left sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
            {t("governance.general")}
          </p>
          <p className="text-left sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
            {t("governance.finance")}
          </p>
        </div>
        <div className="mt-12 max-w-xs sm:max-w-3xl mx-auto text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          <p>Downloads</p>
          <div className="mt-8 flex flex-col gap-8 text-lg font-normal">
            <a
              // href="/documents/Policy_Plan_Pharma4Ghana_2026-2029.docx"
              href="#"
              download
              className="flex justify-between items-center border-b border-gray-900 hover:border-ghana-red hover:text-ghana-red cursor-pointer pb-2 pr-2"
            >
              {t("governance.documents.policyPlan")} - coming soon
              <ArrowDownToLine />
            </a>
            {/* <a
              // href="/documents"
              download
              className="flex justify-between items-center border-b border-gray-900 hover:border-ghana-red hover:text-ghana-red cursor-pointer pb-2 pr-2"
            >
              {t("governance.documents.annualReport")}
              <ArrowDownToLine />
            </a>
            <a
              // href="/documents"
              download
              className="flex justify-between items-center border-b border-gray-900 hover:border-ghana-red hover:text-ghana-red cursor-pointer pb-2 pr-2"
            >
              {t("governance.documents.financialStatements")}
              <ArrowDownToLine />
            </a> */}
          </div>
        </div>
      </section>
    </>
  );
}
