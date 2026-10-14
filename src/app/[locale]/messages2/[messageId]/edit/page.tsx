import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { notFound, redirect } from "next/navigation";
import MessageEditor from "@/components/admin/message-editor";
import { fetchAuthQuery, isAuthenticated } from "@/lib/auth-server";

export default async function EditMessagePage({
  params,
}: {
  params: Promise<{ locale: string; messageId: string }>;
}) {
  const { locale, messageId } = await params;

  if (!(await isAuthenticated())) {
    redirect("/admin/sign-in");
  }

  const id = messageId as Id<"message">;
  const [message, user] = await Promise.all([
    fetchAuthQuery(api.message.get, { messageId: id }),
    fetchAuthQuery(api.auth.getCurrentUser, {}),
  ]);

  if (!message) {
    notFound();
  }

  return (
    <main className="bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === "nl" ? "Bericht bewerken" : "Edit message"}
          </h1>
        </header>
        <MessageEditor
          authorName={user.name}
          returnHref={`/${locale}/messages2/${messageId}`}
          initialMessage={message}
        />
      </div>
    </main>
  );
}
