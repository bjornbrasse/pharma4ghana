"use client";

import { useConvexAuth, usePaginatedQuery } from "convex/react";
import type { PaginatedQueryArgs, PaginatedQueryReference } from "convex/react";
import type { ReactNode } from "react";

const PAGE_SIZE = 25;

// Waits for the Convex auth token before subscribing, so admin queries never run unauthenticated.
export function useAdminPaginatedQuery<Query extends PaginatedQueryReference>(query: Query) {
  const { isAuthenticated } = useConvexAuth();
  return usePaginatedQuery(
    query,
    (isAuthenticated ? {} : "skip") as PaginatedQueryArgs<Query> | "skip",
    { initialNumItems: PAGE_SIZE },
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export function PaginationFooter({
  status,
  loadMore,
  count,
}: {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (numItems: number) => void;
  count: number;
}) {
  if (status === "LoadingFirstPage") {
    return <p className="mt-4 text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <span>
        {count} {count === 1 ? "item" : "items"}
        {status === "Exhausted" ? "" : " loaded"}
      </span>
      {status !== "Exhausted" ? (
        <button
          type="button"
          onClick={() => loadMore(PAGE_SIZE)}
          disabled={status === "LoadingMore"}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-800 hover:border-ghana-green hover:text-ghana-green disabled:opacity-60"
        >
          {status === "LoadingMore" ? "Loading…" : "Load more"}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-sm text-gray-500">
        {children}
      </td>
    </tr>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: "green" | "gold" | "gray";
  children: ReactNode;
}) {
  const tones = {
    green: "bg-green-100 text-green-800",
    gold: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export const th =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
export const td = "px-4 py-3 align-top text-sm text-gray-800";

export function formatAmount(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

export function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
