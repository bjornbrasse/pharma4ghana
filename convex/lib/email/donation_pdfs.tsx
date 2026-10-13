"use node";

import {
  Document,
  type DocumentProps,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";

export type DonationPdfLocale = "en" | "nl";
export type DonationPdfFrequency = "monthly" | "once";

export type DonationPdfInput = {
  locale: DonationPdfLocale;
  receiptNumber: string;
  paidAt: number;
  amount: number;
  currency: string;
  paymentReference: string;
  donorName?: string;
  donorEmail: string;
  subscriptionReference?: string;
};

export type AnnualDonationPdfInput = {
  locale: DonationPdfLocale;
  year: number;
  donorName?: string;
  donorEmail: string;
  donations: Array<{ paidAt: number; amount: number; currency: string }>;
};

const organizationName = "Stichting Pharma4Ghana";
const registration = "[KvK-nummer] / [RSIN]";
const green = "#006b4f";
const paleGreen = "#edf8f3";
const ink = "#263746";
const gold = "#f4c430";

const styles = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 34,
    paddingHorizontal: 38,
    color: ink,
    fontFamily: "Helvetica",
    fontSize: 9,
  },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 34 },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: green,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    textAlign: "center",
    paddingTop: 14,
    marginRight: 12,
  },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  brandTagline: { color: "#637381", marginTop: 3 },
  title: { color: green, fontFamily: "Helvetica-Bold", fontSize: 19, marginBottom: 8 },
  eyebrow: {
    color: "#637381",
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    marginBottom: 34,
    textTransform: "uppercase",
  },
  amount: { color: green, fontFamily: "Helvetica-Bold", fontSize: 24, marginBottom: 10 },
  panel: { backgroundColor: paleGreen, paddingVertical: 10, paddingHorizontal: 11 },
  row: { flexDirection: "row", minHeight: 23, alignItems: "center" },
  label: { width: 176, color: "#526372", fontSize: 8 },
  value: { flex: 1, color: "#101820", fontSize: 8.5 },
  note: { marginTop: 30, lineHeight: 1.45, color: "#536474", fontSize: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: green,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#9db5aa",
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  tableDate: { width: "55%" },
  tableAmount: { width: "45%" },
  total: {
    flexDirection: "row",
    backgroundColor: paleGreen,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 8,
    paddingHorizontal: 11,
    marginTop: 18,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 38,
    right: 38,
    borderTopWidth: 1,
    borderTopColor: "#9db5aa",
    paddingTop: 7,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#637381",
    fontSize: 7,
  },
});

const successStyles = StyleSheet.create({
  page: {
    padding: 28,
    backgroundColor: "#f4f6f5",
    color: "#111827",
    fontFamily: "Helvetica",
    fontSize: 8,
  },
  confirmation: {
    paddingVertical: 22,
    paddingHorizontal: 28,
    backgroundColor: green,
    textAlign: "center",
  },
  confirmationEyebrow: {
    marginBottom: 7,
    color: gold,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  confirmationTitle: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
  },
  confirmationSubtitle: {
    marginTop: 8,
    color: "#d1fae5",
    fontSize: 8.5,
    lineHeight: 1.45,
  },
  receipt: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  identity: { flexDirection: "row", alignItems: "center" },
  logo: { width: 48, height: 48, marginRight: 12, objectFit: "contain" },
  receiptTitle: { fontFamily: "Helvetica-Bold", fontSize: 16 },
  receiptSubtitle: { marginTop: 4, color: "#6b7280", fontSize: 8 },
  receiptNumberBlock: { width: 170, textAlign: "right" },
  label: {
    color: "#6b7280",
    fontFamily: "Helvetica-Bold",
    fontSize: 6.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  receiptNumber: { marginTop: 5, color: "#374151", fontFamily: "Courier", fontSize: 7.5 },
  parties: { flexDirection: "row", justifyContent: "space-between", padding: 20 },
  party: { width: "47%" },
  sectionTitle: {
    marginBottom: 9,
    color: green,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  organizationName: { marginBottom: 4, fontFamily: "Helvetica-Bold", fontSize: 8.5 },
  addressLine: { marginBottom: 3, color: "#4b5563", lineHeight: 1.25 },
  details: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  detailRow: {
    flexDirection: "row",
    minHeight: 22,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailRowLast: { flexDirection: "row", minHeight: 22, alignItems: "center" },
  detailLabel: { width: 150, color: "#6b7280", fontFamily: "Helvetica-Bold" },
  detailValue: { flex: 1, color: "#111827" },
  paid: { color: green, fontFamily: "Helvetica-Bold" },
  notes: { padding: 20 },
  note: { marginBottom: 6, color: "#4b5563", lineHeight: 1.45 },
  footer: {
    position: "absolute",
    right: 28,
    bottom: 15,
    left: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#6b7280",
    fontSize: 6.5,
  },
});

function localeCode(locale: DonationPdfLocale) {
  return locale === "nl" ? "nl-NL" : "en-GB";
}

function formatAmount(amount: number, currency: string, locale: DonationPdfLocale) {
  return new Intl.NumberFormat(localeCode(locale), {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number, locale: DonationPdfLocale) {
  return new Intl.DateTimeFormat(localeCode(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

function addMonth(timestamp: number) {
  const date = new Date(timestamp);
  date.setUTCMonth(date.getUTCMonth() + 1);
  return date.getTime();
}

function Brand() {
  return (
    <View style={styles.brand}>
      <Text style={styles.brandMark}>P4G</Text>
      <View>
        <Text style={styles.brandName}>Pharma4Ghana</Text>
        <Text style={styles.brandTagline}>Supporting pharmacy education in Ghana</Text>
      </View>
    </View>
  );
}

function Footer({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Stichting Pharma4Ghana | www.pharma4ghana.com</Text>
      <Text>Page {page}</Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function render(document: React.ReactElement<DocumentProps>) {
  return renderToBuffer(document);
}

function SuccessDetailRow({
  label,
  value,
  last = false,
  paid = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  paid?: boolean;
}) {
  return (
    <View style={last ? successStyles.detailRowLast : successStyles.detailRow}>
      <Text style={successStyles.detailLabel}>{label}</Text>
      <Text
        style={paid ? [successStyles.detailValue, successStyles.paid] : successStyles.detailValue}
      >
        {value}
      </Text>
    </View>
  );
}

export function renderSuccessPageDonationPdf(
  input: DonationPdfInput,
  frequency: DonationPdfFrequency,
): Promise<Buffer> {
  const dutch = input.locale === "nl";
  const notProvided = dutch ? "Niet opgegeven" : "Not provided";
  const purpose = dutch
    ? "Vrijwillige donatie ter ondersteuning van farmaceutisch onderwijs"
    : "Voluntary donation supporting pharmacy education";

  return render(
    <Document title={dutch ? "Donatiebewijs" : "Donation receipt"}>
      <Page size="A4" style={successStyles.page}>
        <View style={successStyles.confirmation}>
          <Text style={successStyles.confirmationEyebrow}>
            {dutch ? "Betaling bevestigd" : "Payment confirmed"}
          </Text>
          <Text style={successStyles.confirmationTitle}>
            {dutch ? "Dank u voor uw bijdrage" : "Thank you for your contribution"}
          </Text>
          <Text style={successStyles.confirmationSubtitle}>
            {dutch
              ? "Uw betaling is geverifieerd. Hieronder staat uw donatiebewijs."
              : "Your payment was verified. Your donation receipt is shown below."}
          </Text>
        </View>

        <View style={successStyles.receipt}>
          <View style={successStyles.header}>
            <View style={successStyles.identity}>
              <Image src="https://pharma4ghana.com/images/logo.png" style={successStyles.logo} />
              <View>
                <Text style={successStyles.receiptTitle}>
                  {dutch ? "Donatiebewijs" : "Donation receipt"}
                </Text>
                <Text style={successStyles.receiptSubtitle}>
                  {dutch
                    ? "Bewijs van een vrijwillige gift"
                    : "Receipt for a voluntary contribution"}
                </Text>
              </View>
            </View>
            <View style={successStyles.receiptNumberBlock}>
              <Text style={successStyles.label}>{dutch ? "Bewijsnummer" : "Receipt number"}</Text>
              <Text style={successStyles.receiptNumber}>{input.receiptNumber}</Text>
            </View>
          </View>

          <View style={successStyles.parties}>
            <View style={successStyles.party}>
              <Text style={successStyles.sectionTitle}>{dutch ? "Ontvanger" : "Recipient"}</Text>
              <Text style={successStyles.organizationName}>{organizationName}</Text>
              <Text style={successStyles.addressLine}>Street and house number</Text>
              <Text style={successStyles.addressLine}>1234 Vught</Text>
              <Text style={successStyles.addressLine}>Netherlands</Text>
              <Text style={successStyles.addressLine}>contact@pharma4ghana.com</Text>
              <SuccessDetailRow label={dutch ? "KvK-nummer" : "KvK number"} value="KvK number" />
              <SuccessDetailRow label="RSIN" value="RSIN number" last />
            </View>
            <View style={successStyles.party}>
              <Text style={successStyles.sectionTitle}>{dutch ? "Donateur" : "Donor"}</Text>
              <SuccessDetailRow
                label={dutch ? "Naam" : "Name"}
                value={input.donorName ?? notProvided}
              />
              <SuccessDetailRow label={dutch ? "E-mail" : "Email"} value={input.donorEmail} />
              <SuccessDetailRow label={dutch ? "Adres" : "Address"} value={notProvided} last />
            </View>
          </View>

          <View style={successStyles.details}>
            <Text style={successStyles.sectionTitle}>
              {dutch ? "Donatiegegevens" : "Donation details"}
            </Text>
            <SuccessDetailRow
              label={dutch ? "Betaaldatum" : "Payment date"}
              value={formatDate(input.paidAt, input.locale)}
            />
            <SuccessDetailRow
              label={dutch ? "Bedrag" : "Amount"}
              value={formatAmount(input.amount, input.currency, input.locale)}
            />
            <SuccessDetailRow
              label={dutch ? "Betaalstatus" : "Payment status"}
              value={dutch ? "Betaald" : "Paid"}
              paid
            />
            <SuccessDetailRow
              label={dutch ? "Frequentie" : "Frequency"}
              value={
                frequency === "monthly"
                  ? dutch
                    ? "Maandelijks"
                    : "Monthly"
                  : dutch
                    ? "Eenmalig"
                    : "One-time"
              }
            />
            <SuccessDetailRow
              label={dutch ? "Begunstigde" : "Beneficiary"}
              value="Pharma4Ghana - supporting pharmacy education"
            />
            <SuccessDetailRow label={dutch ? "Doel" : "Purpose"} value={purpose} />
            <SuccessDetailRow
              label={dutch ? "Stripe-transactiereferentie" : "Stripe transaction reference"}
              value={input.paymentReference}
              last
            />
          </View>

          <View style={successStyles.notes}>
            <Text style={successStyles.note}>
              {dutch
                ? "Bewaar dit bewijs bij uw belastingadministratie. Of de gift aftrekbaar is, hangt af van uw situatie en de toepasselijke fiscale status van de stichting."
                : "Keep this receipt with your tax records. Eligibility for a deduction depends on your circumstances and the foundation's applicable tax status."}
            </Text>
            <Text style={successStyles.note}>
              {dutch
                ? "Voor deze vrijwillige bijdrage zijn geen goederen of diensten geleverd."
                : "No goods or services were supplied in exchange for this voluntary contribution."}
            </Text>
          </View>
        </View>

        <View style={successStyles.footer} fixed>
          <Text>Stichting Pharma4Ghana | www.pharma4ghana.com</Text>
          <Text>{dutch ? "Donatiebewijs" : "Donation receipt"}</Text>
        </View>
      </Page>
    </Document>,
  );
}

export function renderOneTimeDonationPdf(input: DonationPdfInput): Promise<Buffer> {
  const dutch = input.locale === "nl";
  return render(
    <Document title={dutch ? "Bewijs eenmalige donatie" : "One-time donation receipt"}>
      <Page size="A4" style={styles.page}>
        <Brand />
        <Text style={styles.title}>
          {dutch ? "Hartelijk dank voor uw donatie!" : "Thank you for your donation!"}
        </Text>
        <Text style={styles.eyebrow}>
          {dutch ? "Donatiebewijs | Eenmalige gift" : "Donation receipt | One-time gift"}
        </Text>
        <Text style={styles.amount}>
          {formatAmount(input.amount, input.currency, input.locale)}
        </Text>
        <View style={styles.panel}>
          <DetailRow
            label={dutch ? "Betaald op" : "Paid on"}
            value={formatDate(input.paidAt, input.locale)}
          />
          <DetailRow
            label={dutch ? "Betaalstatus" : "Payment status"}
            value={dutch ? "Betaald" : "Paid"}
          />
          <DetailRow
            label={dutch ? "Bewijsnummer" : "Receipt number"}
            value={input.receiptNumber}
          />
          <DetailRow
            label={dutch ? "Transactiereferentie" : "Transaction reference"}
            value={input.paymentReference}
          />
          <DetailRow label={dutch ? "Ontvanger" : "Recipient"} value={organizationName} />
          <DetailRow label={dutch ? "Donateur" : "Donor"} value={input.donorName ?? "-"} />
          <DetailRow label="E-mail" value={input.donorEmail} />
          <DetailRow label="KvK / RSIN" value={registration} />
        </View>
        <Text style={styles.note}>
          {dutch
            ? "Dit is een donatiebewijs, niet zijnde een factuur. Controleer de gegevens en bewaar dit document voor uw administratie."
            : "This is a donation receipt, not an invoice. Please check the details and retain this document for your records."}
        </Text>
        <Footer page={1} />
      </Page>
    </Document>,
  );
}

export function renderMonthlyDonationPdf(input: DonationPdfInput): Promise<Buffer> {
  const dutch = input.locale === "nl";
  return render(
    <Document title={dutch ? "Bewijs maandelijkse donatie" : "Monthly donation receipt"}>
      <Page size="A4" style={styles.page}>
        <Brand />
        <Text style={styles.title}>
          {dutch ? "Welkom als maandelijkse supporter!" : "Welcome as a monthly supporter!"}
        </Text>
        <Text style={styles.eyebrow}>
          {dutch
            ? "Donatiebevestiging | Eerste betaling ontvangen"
            : "Donation confirmation | Payment received"}
        </Text>
        <Text style={styles.amount}>
          {formatAmount(input.amount, input.currency, input.locale)}{" "}
          {dutch ? "per maand" : "per month"}
        </Text>
        <View style={styles.panel}>
          <DetailRow
            label={dutch ? "Betaling" : "Payment"}
            value={`${formatAmount(input.amount, input.currency, input.locale)} - ${formatDate(input.paidAt, input.locale)}`}
          />
          <DetailRow
            label={dutch ? "Frequentie" : "Frequency"}
            value={dutch ? "Maandelijks, tot opzegging" : "Monthly, until cancelled"}
          />
          <DetailRow
            label={dutch ? "Volgende betaling" : "Next payment"}
            value={formatDate(addMonth(input.paidAt), input.locale)}
          />
          <DetailRow
            label={dutch ? "Bewijsnummer" : "Receipt number"}
            value={input.receiptNumber}
          />
          <DetailRow
            label={dutch ? "Transactiereferentie" : "Transaction reference"}
            value={input.paymentReference}
          />
          <DetailRow
            label={dutch ? "Abonnementsreferentie" : "Subscription reference"}
            value={input.subscriptionReference ?? "-"}
          />
          <DetailRow label={dutch ? "Ontvanger" : "Recipient"} value={organizationName} />
          <DetailRow label={dutch ? "Donateur" : "Donor"} value={input.donorName ?? "-"} />
          <DetailRow label="E-mail" value={input.donorEmail} />
          <DetailRow label="KvK / RSIN" value={registration} />
        </View>
        <Text style={styles.note}>
          {dutch
            ? "Deze eerste betaling maakt deel uit van uw maandelijkse donatie. Bewaar dit document voor uw administratie."
            : "This payment is part of your monthly donation. Please retain this document for your records."}
        </Text>
        <Footer page={1} />
      </Page>
    </Document>,
  );
}

export function renderAnnualDonationOverviewPdf(input: AnnualDonationPdfInput): Promise<Buffer> {
  const dutch = input.locale === "nl";
  const currency = input.donations[0]?.currency ?? "eur";
  const total = input.donations.reduce((sum, donation) => sum + donation.amount, 0);
  return render(
    <Document
      title={`${dutch ? "Jaaroverzicht donaties" : "Annual donation overview"} ${input.year}`}
    >
      <Page size="A4" style={styles.page}>
        <Brand />
        <Text style={styles.title}>
          {dutch
            ? `Jaaroverzicht donaties ${input.year}`
            : `Annual donation overview ${input.year}`}
        </Text>
        <Text style={styles.eyebrow}>
          {dutch ? "Overzicht voor uw belastingaangifte" : "Summary for your tax records"}
        </Text>
        <View style={styles.panel}>
          <DetailRow label={dutch ? "Ontvanger" : "Recipient"} value={organizationName} />
          <DetailRow label={dutch ? "Donateur" : "Donor"} value={input.donorName ?? "-"} />
          <DetailRow label="E-mail" value={input.donorEmail} />
          <DetailRow label="KvK / RSIN" value={registration} />
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.tableDate}>{dutch ? "Betaaldatum" : "Payment date"}</Text>
          <Text style={styles.tableAmount}>{dutch ? "Bedrag" : "Amount"}</Text>
        </View>
        {input.donations.map((donation, index) => (
          <View style={styles.tableRow} key={`${donation.paidAt}-${index}`}>
            <Text style={styles.tableDate}>{formatDate(donation.paidAt, input.locale)}</Text>
            <Text style={styles.tableAmount}>
              {formatAmount(donation.amount, donation.currency, input.locale)}
            </Text>
          </View>
        ))}
        <View style={styles.total}>
          <Text style={styles.tableDate}>
            {dutch ? `TOTAAL ${input.year}` : `TOTAL ${input.year}`}
          </Text>
          <Text style={styles.tableAmount}>{formatAmount(total, currency, input.locale)}</Text>
        </View>
        <Text style={styles.note}>
          {dutch
            ? "Voor belastingdoeleinden kunnen aanvullende voorwaarden gelden. Bewaar dit overzicht samen met uw betaalbewijzen."
            : "Additional conditions may apply for tax purposes. Retain this overview together with your payment records."}
        </Text>
        <Footer page={1} />
      </Page>
    </Document>,
  );
}
