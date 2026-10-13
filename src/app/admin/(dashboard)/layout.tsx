import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/admin-nav";
import { isAuthenticated } from "@/lib/auth-server";

// UX guard only; the Convex admin queries enforce authentication themselves.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
