import { redirect } from "next/navigation";

export default function LegacyAdminNewsletterPage() {
  redirect("/admin/subscribers");
}
