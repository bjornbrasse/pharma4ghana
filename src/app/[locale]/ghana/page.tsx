import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

const profiles = [
  { key: "director" as const, image: "/taking the large.jpg" },
  { key: "teacher" as const, image: "/images/posts/books.jpeg" },
  { key: "student" as const, image: "/images/posts/graduated_students_2026.jpeg" },
  { key: "exchangeStudents" as const, image: "/group.jpg" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ghana.meta" });

  return { title: t("title"), description: t("description") };
}

export default async function GhanaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ghana" });

  return (
    <>
      <section className="relative min-h-136 overflow-hidden">
        <Image
          src="/taking the large.jpg"
          alt={t("hero.imageAlt")}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto flex min-h-136 max-w-7xl items-end px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
              {t("hero.eyebrow")}
            </p>
            <h1 className="text-5xl font-bold sm:text-6xl">{t("hero.title")}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-100 sm:text-xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-0.5 w-8 bg-ghana-gold" />
              <p className="text-sm font-semibold uppercase tracking-wider text-ghana-green">
                {t("intro.eyebrow")}
              </p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("intro.title")}</h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-gray-600">
              <p>{t("intro.paragraph1")}</p>
              <p>{t("intro.paragraph2")}</p>
            </div>
          </div>

          <aside className="border-l-4 border-ghana-gold bg-gray-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-ghana-red">
              {t("partner.label")}
            </p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">{t("partner.name")}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{t("partner.body")}</p>
            <a
              href="https://haighana.edu.gh"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-ghana-green hover:text-ghana-green-dark"
            >
              {t("partner.link")}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ghana-red">
              {t("profiles.eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("profiles.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">{t("profiles.subtitle")}</p>
          </div>

          <div className="divide-y divide-gray-200">
            {profiles.map((profile, index) => (
              <article
                key={profile.key}
                className="grid gap-8 py-12 first:pt-0 last:pb-0 md:grid-cols-2 md:items-center md:gap-12"
              >
                <div
                  className={`relative aspect-4/3 overflow-hidden rounded-lg bg-gray-200 ${index % 2 ? "md:order-2" : ""}`}
                >
                  <Image
                    src={profile.image}
                    alt={t(`profiles.items.${profile.key}.imageAlt`)}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ghana-green">
                    {t(`profiles.items.${profile.key}.label`)}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {t(`profiles.items.${profile.key}.title`)}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
                    {t(`profiles.items.${profile.key}.body`)}
                  </p>
                  <p className="mt-6 border-l-4 border-ghana-gold pl-5 text-lg font-semibold leading-8 text-gray-900">
                    {t(`profiles.items.${profile.key}.testimonial`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
