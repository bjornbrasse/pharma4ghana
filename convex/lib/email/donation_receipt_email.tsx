"use node";

import { Button, Column, Heading, Hr, Row, Section, Text } from "@react-email/components";
import { render } from "@react-email/render";
import React from "react";
import { P4G_EMAIL_COLORS, P4G_EMAIL_SITE_URL, P4gEmail } from "./p4g_email.js";

type DonationReceiptEmailProps = {
  locale: "en" | "nl";
  donorName?: string;
  frequency: "monthly" | "once";
  amount: number;
  currency: string;
  paidAt: number;
  receiptNumber: string;
};

const { green, paleGreen, ink, muted } = P4G_EMAIL_COLORS;

function formatAmount({ amount, currency, locale }: DonationReceiptEmailProps) {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate({ paidAt, locale }: DonationReceiptEmailProps) {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(paidAt));
}

export function DonationReceiptEmail(props: DonationReceiptEmailProps) {
  const dutch = props.locale === "nl";
  const amount = formatAmount(props);
  const date = formatDate(props);
  const firstName = props.donorName?.trim().split(/\s+/)[0];
  const greeting = firstName
    ? dutch
      ? `Beste ${firstName},`
      : `Dear ${firstName},`
    : dutch
      ? "Beste donateur,"
      : "Dear donor,";
  const frequency =
    props.frequency === "monthly"
      ? dutch
        ? "Maandelijkse donatie"
        : "Monthly donation"
      : dutch
        ? "Eenmalige donatie"
        : "One-time donation";
  const preview = dutch
    ? `Dank u wel voor uw donatie van ${amount} aan Pharma4Ghana.`
    : `Thank you for your ${amount} donation to Pharma4Ghana.`;

  return (
    <P4gEmail
      locale={props.locale}
      preview={preview}
      deliveryNote={
        dutch
          ? "U ontvangt deze e-mail omdat uw donatie succesvol is verwerkt."
          : "You received this email because your donation was processed successfully."
      }
    >
      <Text style={eyebrow}>{frequency}</Text>
      <Heading style={heading}>
        {dutch ? "Uw steun maakt onderwijs mogelijk." : "Your support makes education possible."}
      </Heading>
      <Text style={paragraph}>{greeting}</Text>
      <Text style={paragraph}>
        {dutch
          ? "Hartelijk dank voor uw bijdrage. Met uw steun kunnen studenten in Ghana hun opleiding voortzetten en bouwen aan een sterkere farmaceutische zorg."
          : "Thank you for your contribution. Your support helps students in Ghana continue their education and build stronger pharmaceutical care."}
      </Text>

      <Section style={amountPanel}>
        <Text style={amountLabel}>{dutch ? "Uw donatie" : "Your donation"}</Text>
        <Text style={amountValue}>{amount}</Text>
        <Text style={amountMeta}>
          {props.frequency === "monthly"
            ? dutch
              ? "maandelijks"
              : "monthly"
            : dutch
              ? "eenmalig"
              : "one-time"}
        </Text>
      </Section>

      <Section style={detailsPanel}>
        <Row style={detailRow}>
          <Column style={detailLabel}>{dutch ? "Betaald op" : "Paid on"}</Column>
          <Column style={detailValue}>{date}</Column>
        </Row>
        <Row style={detailRow}>
          <Column style={detailLabel}>{dutch ? "Bewijsnummer" : "Receipt number"}</Column>
          <Column style={detailValue}>{props.receiptNumber}</Column>
        </Row>
        <Row>
          <Column style={detailLabel}>{dutch ? "Status" : "Status"}</Column>
          <Column style={paidValue}>{dutch ? "Betaald" : "Paid"}</Column>
        </Row>
      </Section>

      <Text style={paragraph}>
        {dutch
          ? "Uw officiële donatiebewijs vindt u als pdf in de bijlage. Bewaar het document bij uw administratie."
          : "Your official donation receipt is attached as a PDF. Please retain it for your records."}
      </Text>

      <Section style={buttonSection}>
        <Button href={P4G_EMAIL_SITE_URL} style={button}>
          {dutch ? "Bekijk Pharma4Ghana" : "Visit Pharma4Ghana"}
        </Button>
      </Section>

      <Hr style={divider} />
      <Text style={closing}>
        {dutch ? "Met hartelijke groet," : "With gratitude,"}
        <br />
        <strong>{dutch ? "Het team van Pharma4Ghana" : "The Pharma4Ghana team"}</strong>
      </Text>
    </P4gEmail>
  );
}

export function renderDonationReceiptEmail(props: DonationReceiptEmailProps) {
  return render(<DonationReceiptEmail {...props} />);
}

const eyebrow = {
  margin: "0 0 10px",
  color: green,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.8px",
  lineHeight: "16px",
  textTransform: "uppercase" as const,
};

const heading = {
  margin: "0 0 24px",
  color: ink,
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "0",
  lineHeight: "35px",
};

const paragraph = {
  margin: "0 0 18px",
  color: "#405462",
  fontSize: "15px",
  lineHeight: "24px",
};

const amountPanel = {
  margin: "26px 0 14px",
  padding: "24px",
  borderLeft: `4px solid ${green}`,
  borderRadius: "4px",
  backgroundColor: paleGreen,
};

const amountLabel = {
  margin: "0 0 4px",
  color: muted,
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "0.6px",
  lineHeight: "16px",
  textTransform: "uppercase" as const,
};

const amountValue = {
  margin: "0",
  color: green,
  fontSize: "34px",
  fontWeight: "700",
  lineHeight: "40px",
};

const amountMeta = { margin: "2px 0 0", color: muted, fontSize: "13px", lineHeight: "20px" };

const detailsPanel = {
  margin: "0 0 26px",
  padding: "17px 20px",
  border: "1px solid #dce8e3",
  borderRadius: "4px",
};

const detailRow = { borderBottom: "1px solid #e7efeb" };
const detailLabel = { width: "42%", padding: "9px 0", color: muted, fontSize: "12px" };
const detailValue = {
  padding: "9px 0",
  color: ink,
  fontSize: "12px",
  fontWeight: "600",
  textAlign: "right" as const,
};
const paidValue = { ...detailValue, color: green };
const buttonSection = { padding: "8px 0 18px", textAlign: "center" as const };
const button = {
  display: "inline-block",
  padding: "13px 22px",
  borderRadius: "4px",
  backgroundColor: green,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
};
const divider = { margin: "12px 0 24px", borderColor: "#dce8e3" };
const closing = { margin: "0", color: "#405462", fontSize: "14px", lineHeight: "22px" };
