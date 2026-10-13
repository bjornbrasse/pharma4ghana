"use client";

import { api } from "../../../convex/_generated/api";
import {
  EmptyRow,
  formatAmount,
  formatDateTime,
  PaginationFooter,
  StatusBadge,
  TableCard,
  td,
  th,
  useAdminPaginatedQuery,
} from "./admin-ui";

const statusLabels = {
  paid: { label: "Paid", tone: "green" },
  partially_refunded: { label: "Partially refunded", tone: "gold" },
  refunded: { label: "Refunded", tone: "gray" },
} as const;

export default function DonationsTable() {
  const { results, status, loadMore } = useAdminPaginatedQuery(api.admin.listDonations);

  return (
    <>
      <TableCard>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Paid at</th>
              <th className={th}>Donor</th>
              <th className={th}>Purpose</th>
              <th className={th}>Frequency</th>
              <th className={`${th} text-right`}>Amount</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status !== "LoadingFirstPage" && results.length === 0 ? (
              <EmptyRow colSpan={6}>No donations yet.</EmptyRow>
            ) : null}
            {results.map((donation) => {
              const statusLabel = statusLabels[donation.status];
              return (
                <tr key={donation._id}>
                  <td className={`${td} whitespace-nowrap`}>{formatDateTime(donation.paidAt)}</td>
                  <td className={td}>
                    <p className="font-medium">{donation.name ?? "—"}</p>
                    <a
                      href={`mailto:${donation.email}`}
                      className="text-xs text-ghana-green hover:underline"
                    >
                      {donation.email}
                    </a>
                  </td>
                  <td className={td}>{donation.purpose}</td>
                  <td className={td}>
                    {donation.frequency === "monthly" ? "Monthly" : "One-time"}
                  </td>
                  <td className={`${td} whitespace-nowrap text-right font-semibold`}>
                    {formatAmount(donation.amount, donation.currency)}
                    {donation.refundedAmount > 0 ? (
                      <p className="text-xs font-normal text-gray-500">
                        −{formatAmount(donation.refundedAmount, donation.currency)} refunded
                      </p>
                    ) : null}
                  </td>
                  <td className={td}>
                    <StatusBadge tone={statusLabel.tone}>{statusLabel.label}</StatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>
      <PaginationFooter status={status} loadMore={loadMore} count={results.length} />
    </>
  );
}
