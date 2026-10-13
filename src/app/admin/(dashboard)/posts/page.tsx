import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, TableCard, td, th } from "@/components/admin/admin-ui";
import {
  type AppLocale,
  formatMessageDate,
  getLocalizedMessagePost,
  getMessagePostSlugs,
} from "@/lib/messages";

export const metadata: Metadata = { title: "News posts" };

function getTitle(slug: string, locale: AppLocale) {
  try {
    return getLocalizedMessagePost(slug, locale).title;
  } catch {
    return null;
  }
}

export default function AdminNewsPostsPage() {
  const posts = getMessagePostSlugs()
    .map((slug) => {
      const en = getLocalizedMessagePost(slug, "en");
      return { slug, publishedAt: en.publishedAt, en: en.title, nl: getTitle(slug, "nl") };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <PageHeader
        title="News posts"
        description="Markdown posts from src/content/messages, shown on the website's messages page."
      />
      <TableCard>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={th}>Published</th>
              <th className={th}>Title (EN)</th>
              <th className={th}>Title (NL)</th>
              <th className={th}>View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className={`${td} whitespace-nowrap`}>
                  {formatMessageDate("en", post.publishedAt)}
                </td>
                <td className={td}>
                  <p className="font-medium">{post.en}</p>
                  <p className="font-mono text-xs text-gray-500">{post.slug}</p>
                </td>
                <td className={td}>{post.nl ?? <span className="text-red-700">Missing</span>}</td>
                <td className={`${td} whitespace-nowrap`}>
                  <Link
                    href={`/en/messages/${post.slug}`}
                    target="_blank"
                    className="text-ghana-green hover:underline"
                  >
                    EN
                  </Link>
                  {post.nl ? (
                    <>
                      {" · "}
                      <Link
                        href={`/nl/messages/${post.slug}`}
                        target="_blank"
                        className="text-ghana-green hover:underline"
                      >
                        NL
                      </Link>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
      <p className="mt-4 text-sm text-gray-600">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>
    </>
  );
}
