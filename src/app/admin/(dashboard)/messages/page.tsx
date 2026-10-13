import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/admin-ui";
import ContactMessagesList from "@/components/admin/contact-messages-list";

export const metadata: Metadata = { title: "Contact messages" };

export default function AdminContactMessagesPage() {
  return (
    <>
      <PageHeader
        title="Contact messages"
        description="Submissions from the website contact form, newest first."
      />
      <ContactMessagesList />
    </>
  );
}
