import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MessageEditor from "@/components/admin/message-editor";
import { api } from "@convex/_generated/api";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = { title: "Nieuw bericht" };

export default async function NewMessagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await isAuthenticated())) {
    redirect("/admin/sign-in");
  }

  const [t, user] = await Promise.all([
    getTranslations({ locale, namespace: "messagesPage" }),
    fetchAuthQuery(api.auth.getCurrentUser, {}),
  ]);

  return (
    <main className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("newTitle")}</h1>
          <p className="mt-2 text-gray-600">{t("newDescription")}</p>
        </header>
        <MessageEditor
          returnHref={`/${locale}/messages`}
          authorName={user.name}
        />
      </div>
    </main>
  );
}
