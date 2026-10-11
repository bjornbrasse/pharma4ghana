import type { Metadata } from "next";
import { GraduationCap, HandHeart, Leaf, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import DonateForm from "@/components/donate-form";
import { paymentFunctionAvailable } from "@/lib/payment-config";

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

  if (process.env.NODE_ENV === "production" && !paymentFunctionAvailable) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations({ locale, namespace: "donate" });
  const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);
  const trustItems = [
    { key: "education", icon: GraduationCap },
    { key: "healthcare", icon: HandHeart },
    { key: "impact", icon: Leaf },
    { key: "transparent", icon: ShieldCheck },
  ] as const;

  return (
    <div className="bg-[#fbfaf7]">
      <section className="relative min-h-80 overflow-hidden sm:min-h-96">
        <Image
          src="/images/students_in_class_2026.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-white/10" />
        <div className="relative mx-auto flex min-h-80 max-w-7xl items-center px-4 pb-16 pt-10 sm:min-h-96 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-ghana-green">
              {t("hero.header")}
            </p>
            <h1 className="text-4xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {status === "cancel" ? (
            <div className="mb-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-6 py-4 text-yellow-900">
              <p className="mb-1 text-base font-bold">{t("status.cancelTitle")}</p>
              <p className="text-sm leading-relaxed">{t("status.cancelBody")}</p>
            </div>
          ) : null}

          <div className="rounded-3xl border border-gray-100 bg-white p-3 shadow-xl shadow-slate-900/5 sm:p-4">
            <DonateForm locale={locale} enabled={stripeEnabled} />
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>{t("security.cancel")}</span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-ghana-green" aria-hidden="true" />
              {t("security.stripe")}
            </span>
          </div>

          <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className={`flex items-start gap-3 ${
                  index > 0 ? "lg:border-l lg:border-slate-200 lg:pl-6" : ""
                }`}
              >
                <Icon
                  className="mt-0.5 size-8 shrink-0 text-ghana-green"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{t(`trust.${key}.title`)}</h2>
                  <p className="mt-0.5 text-xs leading-4 text-slate-500">
                    {t(`trust.${key}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
