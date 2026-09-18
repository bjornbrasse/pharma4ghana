import SmoothAnchorLink from "@/components/smooth-anchor-link";
import { Download, GraduationCap, HandHeart, MonitorPlay, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

const activitySections = [
  {
    key: "grant" as const,
    icon: <GraduationCap aria-hidden="true" />,
    accent: "bg-green-100 text-ghana-green",
    image: "/images/posts/graduated_students_2026.jpeg",
    downloads: [],
  },
  {
    key: "exchange" as const,
    icon: <RefreshCw aria-hidden="true" />,
    accent: "bg-blue-50 text-blue-600",
    image: null,
    downloads: [],
  },
  {
    key: "webinars" as const,
    icon: <MonitorPlay aria-hidden="true" />,
    accent: "bg-ghana-gold/20 text-yellow-600",
    image: null,
    downloads: [],
  },
  {
    key: "support" as const,
    icon: <HandHeart aria-hidden="true" />,
    accent: "bg-ghana-red/10 text-ghana-red",
    image: "/images/posts/books.jpeg",
    downloads: [
      {
        key: "policyPlan" as const,
        href: "/documents/Policy_Plan_Pharma4Ghana_2026-2029.docx",
      },
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "activities.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "activities" });

  return (
    <>
      <section className="bg-ghana-green px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{t("hero.title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-green-100 sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <div className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="self-start lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              {t("menuLabel")}
            </p>
            <nav aria-label={t("menuLabel")}>
              <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {activitySections.map((section, index) => (
                  <li key={section.key} className="shrink-0">
                    <SmoothAnchorLink
                      targetId={section.key}
                      className="flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-ghana-green hover:text-ghana-green lg:w-full"
                    >
                      <span className="text-xs text-ghana-green">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {t(`sections.${section.key}.title`)}
                    </SmoothAnchorLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="min-w-0">
            {activitySections.map((section) => {
              const paragraphs = t.raw(`sections.${section.key}.body`) as string[];

              return (
                <section
                  key={section.key}
                  id={section.key}
                  className="scroll-mt-28 border-b border-gray-200 py-14 first:pt-0 last:border-0 last:pb-0"
                >
                  <div className="mb-7 flex items-start gap-4">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 [&>svg]:size-6 ${section.accent}`}
                    >
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {t(`sections.${section.key}.title`)}
                      </h2>
                    </div>
                  </div>

                  <div
                    className={section.image ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_300px]" : ""}
                  >
                    <div className="space-y-5">
                      {paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-8 text-gray-700 sm:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {section.image ? (
                      <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-100 md:order-last">
                        <Image
                          src={section.image}
                          alt={t(`sections.${section.key}.imageAlt`)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    ) : null}
                  </div>

                  {section.downloads.length ? (
                    <div className="mt-9 border-t border-gray-200 pt-6">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
                        {t("downloadsLabel")}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {section.downloads.map((download) => (
                          <a
                            key={download.href}
                            href={download.href}
                            download
                            className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-800 transition-colors hover:border-ghana-green hover:text-ghana-green"
                          >
                            {t(`downloads.${download.key}`)}
                            <Download className="size-5 shrink-0" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </>
  );
}
