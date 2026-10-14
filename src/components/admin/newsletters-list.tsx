"use client";

import Link from "next/link";
import { api } from "@convex/_generated/api";
import {
  EmptyRow,
  formatDateTime,
  PaginationFooter,
  TableCard,
  td,
  th,
  useAdminPaginatedQuery,
} from "./admin-ui";

export default function NewslettersList() {
  const { results, status, loadMore } = useAdminPaginatedQuery(api.admin.listNewsletters);

  return (
    <>
      <TableCard>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Titel</th>
              <th className={th}>Aangemaakt</th>
              <th className={th}>Laatst opgeslagen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status !== "LoadingFirstPage" && results.length === 0 ? (
              <EmptyRow colSpan={3}>Nog geen nieuwsbrieven.</EmptyRow>
            ) : null}
            {results.map((newsletter) => (
              <tr key={newsletter._id}>
                <td className={td}>
                  <Link
                    href={`/admin/newsletters/${newsletter._id}`}
                    className="font-semibold text-ghana-green hover:underline"
                  >
                    {newsletter.title}
                  </Link>
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  {formatDateTime(newsletter.createdAt)}
                </td>
                <td className={`${td} whitespace-nowrap`}>
                  {formatDateTime(newsletter.updatedAt)}
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
