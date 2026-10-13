import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/admin-ui";
import DonationsTable from "@/components/admin/donations-table";

export const metadata: Metadata = { title: "Donations" };

export default function AdminDonationsPage() {
  return (
    <>
      <PageHeader
        title="Donations"
        description="All paid donations recorded from Stripe, newest first."
      />
      <DonationsTable />
    </>
  );
}
