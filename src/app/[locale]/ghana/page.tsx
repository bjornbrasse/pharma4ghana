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


export default async function GhanaPage({
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
            {/* {t("hero.title")} */}
            GHANA!!!
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <p>Introductie HAI</p>
          <p>Meet the director</p>
          <p>Meet the students</p>
          <p>Meet the teachers</p>
          <p>Meet the director</p>
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

    </>
  );
}
