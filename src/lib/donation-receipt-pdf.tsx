import React from "react";
import {
  Document,
  Image as PdfImage,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

type Locale = "en" | "nl";

interface DonationReceiptPdfData {
  locale: Locale;
  sessionId: string;
  date: string;
  amount: string;
  paymentStatus: string;
  paymentIntentId: string;
  donorEmail: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontSize: 11,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 700,
    color: "#14532d",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 64,
    height: 64,
    marginRight: 12,
    objectFit: "contain",
  },
  headerText: {
    flex: 1,
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 20,
    color: "#334155",
  },
  section: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 150,
    color: "#475569",
    fontSize: 10,
  },
  value: {
    flex: 1,
    color: "#0f172a",
    fontSize: 10,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 18,
    fontSize: 9,
    color: "#64748b",
  },
});

function getLabels(locale: Locale) {
  if (locale === "nl") {
    return {
      title: "Pharma4Ghana - Donatiebewijs",
      subtitle: "Bewijs van vrijwillige gift",
      orgSectionTitle: "Organisatiegegevens (testdata)",
      orgNameLabel: "Naam",
      orgAddressLabel: "Adres",
      orgCityLabel: "Postcode en plaats",
      orgCountryLabel: "Land",
      orgRegistrationLabel: "KvK",
      orgTaxLabel: "Fiscaal nummer",
      receiptNumber: "Bewijsnummer",
      date: "Datum",
      amount: "Bedrag",
      paymentStatus: "Betaalstatus",
      transactionReference: "Transactiereferentie",
      donorEmail: "Donateur e-mail",
      paragraphOne:
        "Dit document bevestigt dat Pharma4Ghana een vrijwillige donatie heeft ontvangen ten behoeve van onderwijssteun in Ghana.",
      paragraphTwo:
        "Er zijn geen goederen of diensten geleverd in ruil voor deze bijdrage.",
      generated: "Automatisch gegenereerd op basis van Stripe Checkout.",
    };
  }

  return {
    title: "Pharma4Ghana - Donation Receipt",
    subtitle: "Record of voluntary contribution",
    orgSectionTitle: "Organization details (test data)",
    orgNameLabel: "Name",
    orgAddressLabel: "Address",
    orgCityLabel: "Postal code and city",
    orgCountryLabel: "Country",
    orgRegistrationLabel: "Registration no.",
    orgTaxLabel: "Tax number",
    receiptNumber: "Receipt number",
    date: "Date",
    amount: "Amount",
    paymentStatus: "Payment status",
    transactionReference: "Transaction reference",
    donorEmail: "Donor email",
    paragraphOne:
      "This document confirms that Pharma4Ghana received a voluntary donation in support of education in Ghana.",
    paragraphTwo:
      "No goods or services were provided in exchange for this contribution.",
    generated: "Automatically generated from Stripe Checkout data.",
  };
}

async function getLogoDataUri() {
  try {
    const logoPath = join(process.cwd(), "public", "logo-cropped.jpg");
    const logoBuffer = await readFile(logoPath);

    return `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderDonationReceiptPdf(data: DonationReceiptPdfData): Promise<Buffer> {
  const labels = getLabels(data.locale);
  const logoDataUri = await getLogoDataUri();
  const fakeOrgData = {
    name: "Pharma4Ghana Foundation (Demo)",
    address: "Example Street 123",
    city: "1234 AB Exampletown",
    country: data.locale === "nl" ? "Nederland" : "Netherlands",
    registration: "KvK 00000000 (FAKE)",
    taxNumber: "RSIN 999999999 (FAKE)",
  };

  const document = (
    <Document title={labels.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoDataUri ? <PdfImage src={logoDataUri} style={styles.logo} /> : null}
          <View style={styles.headerText}>
            <Text style={styles.title}>{labels.title}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgSectionTitle}</Text>
            <Text style={styles.value}></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgNameLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgAddressLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgCityLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.city}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgCountryLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.country}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgRegistrationLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.registration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgTaxLabel}</Text>
            <Text style={styles.value}>{fakeOrgData.taxNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.receiptNumber}</Text>
            <Text style={styles.value}>{data.sessionId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.date}</Text>
            <Text style={styles.value}>{data.date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.amount}</Text>
            <Text style={styles.value}>{data.amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.paymentStatus}</Text>
            <Text style={styles.value}>{data.paymentStatus}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.transactionReference}</Text>
            <Text style={styles.value}>{data.paymentIntentId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.donorEmail}</Text>
            <Text style={styles.value}>{data.donorEmail}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>{labels.paragraphOne}</Text>
        <Text style={styles.paragraph}>{labels.paragraphTwo}</Text>
        <Text style={styles.footer}>{labels.generated}</Text>
      </Page>
    </Document>
  );

  return renderToBuffer(document);
}
