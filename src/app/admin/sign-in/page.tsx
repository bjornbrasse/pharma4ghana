import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import SignInForm from "@/components/admin/sign-in-form";
import { isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminSignInPage() {
  if (await isAuthenticated()) {
    redirect("/admin/donations");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin sign in</h1>
            <p className="text-sm text-gray-500">Pharma4Ghana</p>
          </div>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
