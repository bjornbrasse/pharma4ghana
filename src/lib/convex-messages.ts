import matter from "gray-matter";

export function parseConvexMessage(content: string) {
  const parsed = matter(content);
  const getString = (field: string) =>
    typeof parsed.data[field] === "string" ? parsed.data[field].trim() : "";

  return {
    title: getString("title"),
    author: getString("author"),
    synopsis: getString("synopsis"),
    content: parsed.content,
  };
}

export function formatConvexMessageDate(locale: string, timestamp: number) {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function getLinkedInHashtagUrl(tag: string) {
  return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
    `#${tag}`,
  )}&origin=HASH_TAG_FROM_FEED`;
}
