import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  formatDonationAmount,
  formatDonationDate,
  getDonationReceipt,
  type DonationLocale,
} from "@/lib/donation-receipt";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate.successMeta" });

  return { title: t("title") };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-gray-100 py-3 last:border-0 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="min-w-0 wrap-break-word text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export default async function DonateSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { session_id: sessionId } = await searchParams;
  const locale: DonationLocale = localeParam === "nl" ? "nl" : "en";
  setRequestLocale(locale);

  if (!sessionId) {
    notFound();
  }

  let receipt;

  try {
    receipt = await getDonationReceipt(sessionId, locale);
  } catch (error) {
    console.error("Unable to show donation receipt", error);
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "donate" });
  const receiptDownloadUrl = `/api/donations/receipt?session_id=${encodeURIComponent(sessionId)}&locale=${locale}`;
  const donorAddress = receipt.donorAddress.join(", ") || t("successPage.notProvided");

  return (
    <>
      <section className="bg-ghana-green px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-ghana-gold">
            {t("successPage.eyebrow")}
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{t("successPage.title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-green-100 sm:text-lg">
            {t("successPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <article className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <header className="flex flex-col gap-6 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <Image
                src="/images/logo.png"
                alt="Pharma4Ghana"
                width={72}
                height={80}
                className="h-16 w-auto object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("successPage.receiptTitle")}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{t("successPage.receiptSubtitle")}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t("successPage.receiptNumber")}
              </p>
              <p className="mt-1 max-w-full wrap-break-word font-mono text-xs text-gray-800">
                {receipt.receiptNumber}
              </p>
            </div>
          </header>

          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ghana-green">
                {t("successPage.issuer")}
              </h3>
              <address className="space-y-1 text-sm not-italic leading-6 text-gray-700">
                <p className="font-bold text-gray-900">{receipt.organization.name}</p>
                <p>{receipt.organization.address}</p>
                <p>{receipt.organization.postalCity}</p>
                <p>{receipt.organization.country}</p>
                <p>{receipt.organization.email}</p>
              </address>
              <dl className="mt-4">
                <DetailRow
                  label={t("successPage.kvk")}
                  value={receipt.organization.registrationNumber}
                />
                <DetailRow label={t("successPage.rsin")} value={receipt.organization.rsin} />
              </dl>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ghana-green">
                {t("successPage.donor")}
              </h3>
              <dl>
                <DetailRow label={t("successPage.name")} value={receipt.donorName} />
                <DetailRow label={t("successPage.email")} value={receipt.donorEmail} />
                <DetailRow label={t("successPage.address")} value={donorAddress} />
              </dl>
            </section>
          </div>

          <section className="border-y border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ghana-green">
              {t("successPage.donationDetails")}
            </h3>
            <dl>
              <DetailRow label={t("successPage.issuedOn")} value={formatDonationDate(receipt)} />
              <DetailRow label={t("successPage.amount")} value={formatDonationAmount(receipt)} />
              <DetailRow label={t("successPage.status")} value={t("successPage.paid")} />
              <DetailRow label={t("successPage.paymentMethod")} value={receipt.paymentMethod} />
              <DetailRow label={t("successPage.beneficiary")} value={receipt.beneficiary} />
              <DetailRow label={t("successPage.purpose")} value={receipt.purpose} />
              <DetailRow
                label={t("successPage.transactionReference")}
                value={receipt.paymentIntentId}
              />
            </dl>
          </section>

          <footer className="p-6 sm:p-8">
            <p className="text-sm leading-6 text-gray-600">{t("successPage.taxNote")}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {t("successPage.noConsideration")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={receiptDownloadUrl}
                className="inline-flex items-center justify-center rounded-md bg-ghana-gold px-5 py-3 text-sm font-bold text-ghana-green transition-colors hover:bg-ghana-gold-dark"
              >
                {t("successPage.downloadPdf")}
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-ghana-green hover:text-ghana-green"
              >
                {t("successPage.home")}
              </Link>
            </div>
          </footer>
        </article>
      </section>
    </>
  );
}
