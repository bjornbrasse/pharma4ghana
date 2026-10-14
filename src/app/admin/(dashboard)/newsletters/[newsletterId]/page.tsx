import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/admin-ui";
import NewsletterEditor from "@/components/admin/newsletter-editor";
import type { Id } from "@convex/_generated/dataModel";

export const metadata: Metadata = { title: "Nieuwsbrief bewerken" };

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ newsletterId: string }>;
}) {
  const { newsletterId } = await params;

  return (
    <>
      <PageHeader
        title="Nieuwsbrief bewerken"
        description="Schrijf de Nederlandse en Engelse versie naast elkaar en sla ze samen op."
      />
      <NewsletterEditor newsletterId={newsletterId as Id<"newsletter">} />
    </>
  );
}
