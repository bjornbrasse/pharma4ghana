import { DownloadItem } from "@/components/download-item";
import { GraduationCap, HandHeart, MonitorPlay, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

type ActivitySection = {
  key: "grant" | "exchange" | "webinars" | "support";
  icon: React.ReactNode;
  accent: string;
  image: string | null;
  downloads?: { title: string; href: string }[];
};

const activitySections: ActivitySection[] = [
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
  },
  {
    key: "support" as const,
    icon: <HandHeart aria-hidden="true" />,
    accent: "bg-ghana-red/10 text-ghana-red",
    image: "/images/posts/books.jpeg",
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
      <section className="bg-ghana-green px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{t("hero.title")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-green-100 sm:mt-6 sm:text-xl">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <div className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <main>
            {activitySections.map((section) => {
              const paragraphs = t.raw(`sections.${section.key}.body`) as string[];

              return (
                <section
                  key={section.key}
                  id={section.key}
                  className="border-b border-gray-200 py-10 first:pt-0 last:border-0 last:pb-0 sm:py-14"
                >
                  <div className="mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200 [&>svg]:size-5 sm:size-12 sm:[&>svg]:size-6 ${section.accent}`}
                    >
                      {section.icon}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-4xl">
                        {t(`sections.${section.key}.title`)}
                      </h2>
                    </div>
                  </div>

                  <div
                    className={section.image ? "grid gap-8 md:grid-cols-[minmax(0,1fr)_300px]" : ""}
                  >
                    <div className="space-y-5">
                      {paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-base leading-7 text-gray-700 sm:text-lg sm:leading-8"
                        >
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

                  {section.downloads?.length ? (
                    <div className="mt-4 pt-6">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gray-500">
                        {t("downloadsLabel")}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {section.downloads.map((download) => (
                          <DownloadItem key={download.href} href={download.href}>
                            {t(`downloads.${download.title}`)}
                          </DownloadItem>
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
