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
import {
  formatDonationAmount,
  formatDonationDate,
  type DonationLocale,
  type DonationReceipt,
} from "@/lib/donation-receipt";

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

function getLabels(locale: DonationLocale) {
  if (locale === "nl") {
    return {
      title: "Pharma4Ghana - Donatiebewijs",
      subtitle: "Bewijs van vrijwillige gift",
      orgSectionTitle: "Gegevens ontvanger",
      donorSectionTitle: "Gegevens donateur",
      orgNameLabel: "Naam",
      orgAddressLabel: "Adres",
      orgCityLabel: "Postcode en plaats",
      orgCountryLabel: "Land",
      orgRegistrationLabel: "KvK",
      orgTaxLabel: "RSIN",
      receiptNumber: "Bewijsnummer",
      date: "Datum",
      amount: "Bedrag",
      paymentStatus: "Betaalstatus",
      paid: "Betaald",
      transactionReference: "Transactiereferentie",
      paymentMethod: "Betaalmethode",
      donorName: "Naam",
      donorEmail: "Donateur e-mail",
      donorAddress: "Adres",
      beneficiary: "Begunstigde",
      purpose: "Doel",
      paragraphOne:
        "Dit document bevestigt dat Pharma4Ghana een vrijwillige donatie heeft ontvangen ten behoeve van onderwijssteun in Ghana. Er zijn geen goederen of diensten geleverd in ruil voor deze bijdrage.",
      paragraphTwo: "Stichting Pharma4Ghana is in Nederland aangemerkt als Algemeen Nut Beogende Instelling (ANBI).",
      paragraphThree: "Bewaar dit bewijs samen met uw betalingsadministratie.",
      generated: "Automatisch gegenereerd op basis van Stripe Checkout.",
    };
  }

  return {
    title: "Pharma4Ghana - Donation Receipt",
    subtitle: "Record of voluntary contribution",
    orgSectionTitle: "Recipient details",
    donorSectionTitle: "Donor details",
    orgNameLabel: "Name",
    orgAddressLabel: "Address",
    orgCityLabel: "Postal code and city",
    orgCountryLabel: "Country",
    orgRegistrationLabel: "Registration no.",
    orgTaxLabel: "RSIN",
    receiptNumber: "Receipt number",
    date: "Date",
    amount: "Amount",
    paymentStatus: "Payment status",
    paid: "Paid",
    transactionReference: "Transaction reference",
    paymentMethod: "Payment method",
    donorName: "Name",
    donorEmail: "Donor email",
    donorAddress: "Address",
    beneficiary: "Beneficiary",
    purpose: "Purpose",
    paragraphOne: "This receipt confirms that Stichting Pharma4Ghana received the voluntary donation stated above. No goods or services were provided in exchange for this donation.",
    paragraphTwo: "Stichting Pharma4Ghana is registered in the Netherlands as an Algemeen Nut Beogende Instelling (ANBI).",
    paragraphThree: "Please retain this receipt together with your payment records for your administration.",
    generated: "Automatically generated from Stripe Checkout data.",
  };
}

async function getLogoDataUri() {
  try {
    const logoPath = join(process.cwd(), "public", "images", "logo.png");
    const logoBuffer = await readFile(logoPath);

    return `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function renderDonationReceiptPdf(receipt: DonationReceipt): Promise<Buffer> {
  const labels = getLabels(receipt.locale);
  const logoDataUri = await getLogoDataUri();

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
            <Text style={styles.value}>{receipt.organization.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgAddressLabel}</Text>
            <Text style={styles.value}>{receipt.organization.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgCityLabel}</Text>
            <Text style={styles.value}>{receipt.organization.postalCity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgCountryLabel}</Text>
            <Text style={styles.value}>{receipt.organization.country}</Text>
          </View>
         {receipt.locale === 'nl' && (<>
           <View style={styles.row}>
            <Text style={styles.label}>{labels.orgRegistrationLabel}</Text>
            <Text style={styles.value}>{receipt.organization.registrationNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.orgTaxLabel}</Text>
            <Text style={styles.value}>{receipt.organization.rsin}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ANBI-status</Text>
            <Text style={styles.value}>Algemeen Nut Beogende Instelling (ANBI)</Text>
          </View>
         </>)}
         </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.receiptNumber}</Text>
            <Text style={styles.value}>{receipt.receiptNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.date}</Text>
            <Text style={styles.value}>{formatDonationDate(receipt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.amount}</Text>
            <Text style={styles.value}>{formatDonationAmount(receipt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.paymentStatus}</Text>
            <Text style={styles.value}>{labels.paid}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.transactionReference}</Text>
            <Text style={styles.value}>{receipt.paymentIntentId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.paymentMethod}</Text>
            <Text style={styles.value}>{receipt.paymentMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.beneficiary}</Text>
            <Text style={styles.value}>{receipt.beneficiary}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.purpose}</Text>
            <Text style={styles.value}>{receipt.purpose}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.donorSectionTitle}</Text>
            <Text style={styles.value}></Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.donorName}</Text>
            <Text style={styles.value}>{receipt.donorName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.donorEmail}</Text>
            <Text style={styles.value}>{receipt.donorEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{labels.donorAddress}</Text>
            <Text style={styles.value}>{receipt.donorAddress.join(", ") || "-"}</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>{labels.paragraphOne}</Text>
        <Text style={styles.paragraph}>{labels.paragraphTwo}</Text>
        <Text style={styles.paragraph}>{labels.paragraphThree}</Text>
        <Text style={styles.footer}>{labels.generated}</Text>
      </Page>
    </Document>
  );

  return renderToBuffer(document);
}
