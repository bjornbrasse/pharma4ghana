import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/admin-ui";
import NewsletterEditor from "@/components/admin/newsletter-editor";

export const metadata: Metadata = { title: "Nieuwe nieuwsbrief" };

export default function NewNewsletterPage() {
  return (
    <>
      <PageHeader
        title="Nieuwe nieuwsbrief"
        description="Schrijf de Nederlandse en Engelse versie naast elkaar in Markdown."
      />
      <NewsletterEditor />
    </>
  );
}
