"use client";

import { api } from "../../../convex/_generated/api";
import { formatDateTime, PaginationFooter, useAdminPaginatedQuery } from "./admin-ui";

export default function ContactMessagesList() {
  const { results, status, loadMore } = useAdminPaginatedQuery(api.admin.listContactMessages);

  return (
    <>
      {status !== "LoadingFirstPage" && results.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No contact messages yet.
        </p>
      ) : null}
      <ul className="space-y-3">
        {results.map((message) => (
          <li key={message._id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <details>
              <summary className="flex cursor-pointer list-none flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">{message.subject}</p>
                  <p className="text-sm text-gray-600">
                    {message.name} · <span className="text-ghana-green">{message.email}</span> ·{" "}
                    {message.locale.toUpperCase()}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-gray-500">
                  {formatDateTime(message.createdAt)}
                </span>
              </summary>
              <div className="border-t border-gray-100 px-5 py-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                  {message.message}
                </p>
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                  className="mt-4 inline-block rounded-md bg-ghana-green px-4 py-2 text-sm font-semibold text-white hover:bg-ghana-green-dark"
                >
                  Reply by email
                </a>
              </div>
            </details>
          </li>
        ))}
      </ul>
      <PaginationFooter status={status} loadMore={loadMore} count={results.length} />
    </>
  );
}
