import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/admin-ui";
import NewslettersList from "@/components/admin/newsletters-list";

export const metadata: Metadata = { title: "Nieuwsbrieven" };

export default function AdminNewslettersPage() {
  return (
    <>
      <PageHeader
        title="Nieuwsbrieven"
        description="Maak en bewerk Nederlandstalige en Engelstalige nieuwsbrieven."
        action={
          <Link
            href="/admin/newsletters/new"
            className="shrink-0 rounded-md bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark"
          >
            Nieuwe nieuwsbrief
          </Link>
        }
      />
      <NewslettersList />
    </>
  );
}
