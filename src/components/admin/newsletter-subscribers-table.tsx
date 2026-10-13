"use client";

import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  EmptyRow,
  formatDateTime,
  PaginationFooter,
  StatusBadge,
  TableCard,
  td,
  th,
  useAdminPaginatedQuery,
} from "./admin-ui";

const statusTones = { active: "green", pending: "gold", unsubscribed: "gray" } as const;

export default function NewsletterSubscribersTable() {
  const { results, status, loadMore } = useAdminPaginatedQuery(api.admin.listNewsletterSubscribers);
  const resendConfirmation = useAction(api.newsletterSubscription.resendConfirmation);
  const [sendingId, setSendingId] = useState<Id<"newsletterSubscriber"> | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  async function resend(subscriberId: Id<"newsletterSubscriber">) {
    setSendingId(subscriberId);
    setMessage(null);

    try {
      const result = await resendConfirmation({ subscriberId });

      if (result === "sent") {
        setMessage({ tone: "success", text: "Confirmation email sent." });
      } else if (result === "not_pending") {
        setMessage({ tone: "error", text: "This subscriber is no longer pending." });
      } else {
        setMessage({ tone: "error", text: "Subscriber not found." });
      }
    } catch {
      setMessage({ tone: "error", text: "Could not resend the confirmation email." });
    } finally {
      setSendingId(null);
    }
  }

  return (
    <>
      {message ? (
        <p
          role={message.tone === "error" ? "alert" : "status"}
          className={`mb-4 text-sm font-medium ${
            message.tone === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      ) : null}
      <TableCard>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Email</th>
              <th className={th}>Name</th>
              <th className={th}>Language</th>
              <th className={th}>Status</th>
              <th className={th}>Subscribed</th>
              <th className={th}>Unsubscribed</th>
              <th className={th}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status !== "LoadingFirstPage" && results.length === 0 ? (
              <EmptyRow colSpan={7}>No newsletter subscribers yet.</EmptyRow>
            ) : null}
            {results.map((subscriber) => (
              <tr key={subscriber._id}>
                <td className={td}>
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="text-ghana-green hover:underline"
                  >
                    {subscriber.email}
                  </a>
                </td>
                <td className={td}>{subscriber.name ?? "—"}</td>
                <td className={td}>{subscriber.locale?.toUpperCase() ?? "—"}</td>
                <td className={td}>
                  <StatusBadge tone={statusTones[subscriber.status]}>
                    {subscriber.status}
                  </StatusBadge>
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  {formatDateTime(subscriber.subscribedAt)}
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  {subscriber.unsubscribedAt ? formatDateTime(subscriber.unsubscribedAt) : "—"}
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  <select
                    aria-label={`Actions for ${subscriber.email}`}
                    value=""
                    disabled={subscriber.status !== "pending" || sendingId !== null}
                    onChange={(event) => {
                      if (event.target.value === "resend") {
                        void resend(subscriber._id);
                      }
                    }}
                    className="min-w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {sendingId === subscriber._id ? "Sending…" : "Actions"}
                    </option>
                    {subscriber.status === "pending" ? (
                      <option value="resend">Resend confirmation</option>
                    ) : null}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
      <PaginationFooter status={status} loadMore={loadMore} count={results.length} />
    </>
  );
}
