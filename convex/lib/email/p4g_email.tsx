"use node";

import { Body, Container, Head, Html, Img, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import React from "react";

export const P4G_EMAIL_SITE_URL = "https://pharma4ghana.com";
export const P4G_EMAIL_COLORS = {
  green: "#006b4f",
  paleGreen: "#edf8f3",
  ink: "#263746",
  muted: "#637381",
} as const;

type P4gEmailProps = {
  locale: "en" | "nl";
  preview: string;
  children: ReactNode;
  deliveryNote?: string;
};

export function P4gEmail({ locale, preview, children, deliveryNote }: P4gEmailProps) {
  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={brandBar}>
            <Img
              src={`${P4G_EMAIL_SITE_URL}/images/logo.png`}
              width="68"
              height="68"
              alt="Pharma4Ghana"
              style={logo}
            />
            <Text style={brandName}>Pharma4Ghana</Text>
            <Text style={tagline}>Supporting pharmacy education in Ghana</Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Section style={footer}>
            <Text style={footerText}>
              Stichting Pharma4Ghana · contact@pharma4ghana.com
              {deliveryNote ? (
                <>
                  <br />
                  {deliveryNote}
                </>
              ) : null}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  margin: "0",
  padding: "32px 12px",
  backgroundColor: "#f3f7f5",
  color: P4G_EMAIL_COLORS.ink,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const container = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  overflow: "hidden",
  border: "1px solid #dce8e3",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  boxShadow: "0 8px 24px rgba(20, 58, 46, 0.08)",
};

const brandBar = {
  padding: "30px 42px 26px",
  backgroundColor: P4G_EMAIL_COLORS.green,
  textAlign: "center" as const,
};

const logo = {
  display: "block",
  margin: "0 auto 12px",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
};

const brandName = {
  margin: "0",
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "28px",
};

const tagline = {
  margin: "5px 0 0",
  color: "#d9f0e7",
  fontSize: "12px",
  lineHeight: "18px",
};

const content = { padding: "38px 42px 32px" };
const footer = { padding: "20px 32px", backgroundColor: "#e5f2ec", textAlign: "center" as const };
const footerText = {
  margin: "0",
  color: P4G_EMAIL_COLORS.muted,
  fontSize: "10px",
  lineHeight: "17px",
};
