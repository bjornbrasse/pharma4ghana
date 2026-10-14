"use client";

import { useMutation } from "convex/react";
import matter from "gray-matter";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@convex/_generated/api";
import type { Doc, Id } from "@convex/_generated/dataModel";
import ImageSelector from "@/components/admin/image-selector";
import MarkdownEditor from "@/components/admin/markdown-editor";

type ExternalLink = { label: string; href: string };

function getMessageTemplate(locale: "nl" | "en", authorName: string) {
  const author = JSON.stringify(authorName);
  const isDutch = locale === "nl";

  return `---
title: ${isDutch ? "Naamloos bericht" : "Untitled message"}
author: ${author}
synopsis: ""
---

# ${isDutch ? "Naamloos bericht" : "Untitled message"}

${isDutch ? "Schrijf hier het Nederlandse bericht." : "Write the English message here."}
`;
}

function getTitle(content: string) {
  const title = matter(content).data.title;
  return typeof title === "string" ? title.trim() : "";
}

export default function MessageEditor({
  authorName,
  returnHref,
  initialMessage,
}: {
  authorName: string;
  returnHref: string;
  initialMessage?: Doc<"message">;
}) {
  const router = useRouter();
  const createMessage = useMutation(api.message.create);
  const updateMessage = useMutation(api.message.update);
  const [contentNl, setContentNl] = useState(
    () => initialMessage?.contentNl ?? getMessageTemplate("nl", authorName),
  );
  const [contentEn, setContentEn] = useState(
    () => initialMessage?.contentEn ?? getMessageTemplate("en", authorName),
  );
  const [imageId, setImageId] = useState<Id<"image"> | undefined>(initialMessage?.imageId);
  const [imageClasses, setImageClasses] = useState(initialMessage?.imageClasses ?? "");
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(
    initialMessage?.externalLinks ?? [],
  );
  const [hashtags, setHashtags] = useState(initialMessage?.hashtags?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateExternalLink(index: number, field: keyof ExternalLink, value: string) {
    setExternalLinks((links) =>
      links.map((link, linkIndex) => (linkIndex === index ? { ...link, [field]: value } : link)),
    );
  }

  async function save() {
    setSaving(true);
    setError(null);

    try {
      const title = getTitle(contentNl);
      if (!title) throw new Error('Voeg een niet-lege "title" toe aan de Nederlandse frontmatter.');
      if (!imageId) throw new Error("Kies een afbeelding.");

      const input = {
        title,
        contentNl,
        contentEn,
        imageId,
        imageClasses: imageClasses.trim(),
        externalLinks: externalLinks
          .map((link) => ({ label: link.label.trim(), href: link.href.trim() }))
          .filter((link) => link.label && link.href),
        hashtags: [
          ...new Set(
            hashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        ],
      };

      if (initialMessage) {
        await updateMessage({ messageId: initialMessage._id, ...input });
      } else {
        await createMessage(input);
      }
      router.push(returnHref);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Het bericht kon niet worden opgeslagen.",
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClassName =
    "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <div className="text-sm font-semibold text-gray-800">
          <span className="mb-1 block">Afbeelding</span>
          <ImageSelector value={imageId} onChange={setImageId} />
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-800">
            Afbeeldingsklassen
            <input
              value={imageClasses}
              onChange={(event) => setImageClasses(event.target.value)}
              className={inputClassName}
            />
          </label>
        </div>
      </section>

      <MarkdownEditor
        contentNl={contentNl}
        contentEn={contentEn}
        onContentNlChange={setContentNl}
        onContentEnChange={setContentEn}
      />

      <section className="space-y-5 rounded-lg border border-gray-200 bg-white p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Externe links</h2>
            <button
              type="button"
              onClick={() => setExternalLinks((links) => [...links, { label: "", href: "" }])}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ghana-green hover:text-ghana-green-dark"
            >
              <Plus className="size-4" aria-hidden="true" /> Link toevoegen
            </button>
          </div>
          {externalLinks.map((link, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
              <input
                aria-label={`Link ${index + 1} label`}
                value={link.label}
                onChange={(event) => updateExternalLink(index, "label", event.target.value)}
                className={inputClassName}
                placeholder="Label"
              />
              <input
                aria-label={`Link ${index + 1} URL`}
                value={link.href}
                onChange={(event) => updateExternalLink(index, "href", event.target.value)}
                className={inputClassName}
                placeholder="https://"
              />
              <button
                type="button"
                onClick={() =>
                  setExternalLinks((links) => links.filter((_, linkIndex) => linkIndex !== index))
                }
                aria-label={`Link ${index + 1} verwijderen`}
                title="Verwijderen"
                className="mt-1 grid size-10 place-items-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <label className="block text-sm font-semibold text-gray-800">
          Hashtags
          <input
            value={hashtags}
            onChange={(event) => setHashtags(event.target.value)}
            className={inputClassName}
            placeholder="ghana, onderwijs, apotheek"
          />
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-md bg-ghana-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark disabled:opacity-60"
        >
          {saving ? "Opslaan…" : initialMessage ? "Wijzigingen opslaan" : "Bericht opslaan"}
        </button>
        <Link
          href={returnHref}
          className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-ghana-green hover:text-ghana-green"
        >
          Terug naar overzicht
        </Link>
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
