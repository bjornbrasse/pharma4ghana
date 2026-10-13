import type { Metadata } from "next";
import AddSubscriberDialog from "@/components/admin/add-subscriber-dialog";
import { PageHeader } from "@/components/admin/admin-ui";
import NewsletterSubscribersTable from "@/components/admin/newsletter-subscribers-table";

export const metadata: Metadata = { title: "Newsletter subscribers" };

export default function AdminSubscribersPage() {
  return (
    <>
      <PageHeader
        title="Abonnees"
        description="Iedereen die zich heeft aangemeld voor de nieuwsbrief, nieuwste eerst."
        action={<AddSubscriberDialog />}
      />
      <NewsletterSubscribersTable />
    </>
  );
}
