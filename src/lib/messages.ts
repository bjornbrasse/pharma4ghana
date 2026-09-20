import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { cache } from "react";

export const appLocaleSchema = z.enum(["en", "nl"]);

export type AppLocale = z.infer<typeof appLocaleSchema>;

const externalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const sharedMessageMetaSchema = z.object({
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must use YYYY-MM-DD"),

  image: z.string().min(1),

  imageClasses: z.string().optional(),

  ogImage: z.string().optional(),

  externalLinks: z.array(externalLinkSchema).default([]),

  hashtags: z.array(z.string().min(1)).default([]),
});

export type SharedMessageMeta = z.infer<typeof sharedMessageMetaSchema>;

const localizedMessageMetaSchema = z.object({
  title: z.string().min(1),

  author: z.string().min(1).optional(),

  synopsis: z.string().min(1),

  imageAlt: z.string(),
});

export type LocalizedMessageMeta = z.infer<typeof localizedMessageMetaSchema>;

export type LocalizedMessagePost = SharedMessageMeta &
  LocalizedMessageMeta & {
    slug: string;
    content: string;
  };

const messagesDirectory = path.join(process.cwd(), "src/content/messages");

function getSharedMessageMeta(slug: string): SharedMessageMeta {
  const filename = path.join(messagesDirectory, slug, "meta.yaml");

  const source = fs.readFileSync(filename, "utf8");

  return parseSharedMeta(slug, source);
}

function getLocalizedMessageContent(slug: string, locale: AppLocale) {
  const filename = path.join(messagesDirectory, slug, `${locale}.md`);

  const source = fs.readFileSync(filename, "utf8");

  const { data, content } = matter(source);

  const metadata = localizedMessageMetaSchema.parse(data);

  return {
    ...metadata,
    content,
  };
}

export const getLocalizedMessagePost = cache(
  (slug: string, locale: AppLocale): LocalizedMessagePost => {
    const shared = getSharedMessageMeta(slug);

    const localized = getLocalizedMessageContent(slug, locale);

    return {
      slug,
      ...shared,
      ...localized,
    };
  },
);

export function getMessagePostSlugs(): string[] {
  return fs
    .readdirSync(messagesDirectory, {
      withFileTypes: true,
    })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getLocalizedMessagePosts(locale: AppLocale): LocalizedMessagePost[] {
  return getMessagePostSlugs()
    .map((slug) => getLocalizedMessagePost(slug, locale))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function formatMessageDate(locale: AppLocale, publishedAt: string) {
  const [year, month, day] = publishedAt.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getLinkedInHashtagUrl(tag: string) {
  return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
    `#${tag}`,
  )}&origin=HASH_TAG_FROM_FEED`;
}

function parseSharedMeta(slug: string, source: string) {
  const result = sharedMessageMetaSchema.safeParse(YAML.parse(source));

  if (!result.success) {
    throw new Error(`Invalid meta.yaml for "${slug}":\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}
