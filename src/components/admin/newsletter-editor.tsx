"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import matter from "gray-matter";
import { CircleHelp, Eye, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

const NEWSLETTER_TEMPLATE_NL = `---
title: Naamloze nieuwsbrief
subject: Onderwerp van de nieuwsbrief
previewText: Een korte introductie van deze nieuwsbrief
---

# Naamloze nieuwsbrief

Schrijf hier de Nederlandse nieuwsbrief.
`;

const NEWSLETTER_TEMPLATE_EN = `---
title: Untitled newsletter
subject: Newsletter subject
previewText: A short introduction to this newsletter
---

# Untitled newsletter

Write the English newsletter here.
`;

type ParsedNewsletter = {
  body: string;
  title?: string;
  subject?: string;
  previewText?: string;
};

function parseNewsletter(content: string): ParsedNewsletter {
  const parsed = matter(content);
  const getString = (field: string) =>
    typeof parsed.data[field] === "string" ? parsed.data[field].trim() : undefined;

  return {
    body: parsed.content,
    title: getString("title"),
    subject: getString("subject"),
    previewText: getString("previewText"),
  };
}

function stringOrFallback(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export default function NewsletterEditor({ newsletterId }: { newsletterId?: Id<"newsletter"> }) {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const newsletter = useQuery(
    api.admin.getNewsletter,
    isAuthenticated && newsletterId ? { newsletterId } : "skip",
  );
  const createNewsletter = useMutation(api.admin.createNewsletter);
  const updateNewsletter = useMutation(api.admin.updateNewsletter);
  const loadedNewsletterId = useRef<Id<"newsletter"> | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const previewCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const helpTriggerRef = useRef<HTMLButtonElement | null>(null);
  const helpCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const [contentNl, setContentNl] = useState(NEWSLETTER_TEMPLATE_NL);
  const [contentEn, setContentEn] = useState(NEWSLETTER_TEMPLATE_EN);
  const [preview, setPreview] = useState<{
    nl: string;
    en: string;
  } | null>(null);
  const [previewLocale, setPreviewLocale] = useState<"nl" | "en">("nl");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (newsletter && loadedNewsletterId.current !== newsletter._id) {
      const localizedContentNl = newsletter.contentNl;
      const localizedContentEn = newsletter.contentEn;
      setContentNl(stringOrFallback(localizedContentNl, NEWSLETTER_TEMPLATE_NL));
      setContentEn(stringOrFallback(localizedContentEn, NEWSLETTER_TEMPLATE_EN));
      loadedNewsletterId.current = newsletter._id;
    }
  }, [newsletter]);

  useEffect(() => {
    if (!preview) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previewCloseButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreview(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previewTriggerRef.current?.focus();
    };
  }, [preview]);

  useEffect(() => {
    if (!helpOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    helpCloseButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setHelpOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      helpTriggerRef.current?.focus();
    };
  }, [helpOpen]);

  function parseBothLocales() {
    const nl = parseNewsletter(contentNl);
    const en = parseNewsletter(contentEn);

    if (!nl.title) {
      throw new Error('Voeg in de Nederlandse YAML-frontmatter een niet-lege "title" toe.');
    }

    return { nl, en };
  }

  async function showPreview() {
    setMessage(null);
    setError(null);
    setHelpOpen(false);

    try {
      parseBothLocales();
      setPreviewLocale("nl");
      setPreview({ nl: "", en: "" });
      setPreviewLoading(true);

      const renderLocale = async (locale: "nl" | "en", markdown: string) => {
        const response = await fetch("/api/admin/newsletter-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale, markdown }),
        });
        const result = (await response.json()) as { html?: string; error?: string };

        if (!response.ok || !result.html) {
          throw new Error(result.error ?? "Het e-mailvoorbeeld kon niet worden gemaakt.");
        }

        return result.html;
      };
      const [nl, en] = await Promise.all([
        renderLocale("nl", contentNl),
        renderLocale("en", contentEn),
      ]);
      setPreview({ nl, en });
    } catch (previewError) {
      setPreview(null);
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Het voorbeeld kon niet worden gemaakt.",
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { nl } = parseBothLocales();
      const input = { title: nl.title!, contentNl, contentEn };

      if (newsletterId) {
        await updateNewsletter({ newsletterId, ...input });
        setMessage("Nieuwsbrief opgeslagen.");
      } else {
        const id = await createNewsletter(input);
        router.replace(`/admin/newsletters/${id}`);
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "De nieuwsbrief kon niet worden opgeslagen.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (newsletterId && newsletter === undefined) {
    return <p className="text-sm text-gray-500">Nieuwsbrief laden…</p>;
  }

  if (newsletterId && newsletter === null) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-800">Nieuwsbrief niet gevonden.</p>
        <Link
          href="/admin/newsletters"
          className="mt-2 inline-block text-sm text-red-800 underline"
        >
          Terug naar nieuwsbrieven
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <label
            htmlFor="newsletter-content-nl"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Nederlands
          </label>
          <textarea
            id="newsletter-content-nl"
            value={contentNl}
            onChange={(event) => {
              setContentNl(event.target.value);
              setMessage(null);
              setPreview(null);
            }}
            spellCheck={false}
            className="min-h-[60vh] w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
          />
        </div>
        <div>
          <label
            htmlFor="newsletter-content-en"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Engels
          </label>
          <textarea
            id="newsletter-content-en"
            value={contentEn}
            onChange={(event) => {
              setContentEn(event.target.value);
              setMessage(null);
              setPreview(null);
            }}
            spellCheck={false}
            className="min-h-[60vh] w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-md bg-ghana-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark disabled:opacity-60"
        >
          {saving ? "Opslaan…" : "Nieuwsbrief opslaan"}
        </button>
        <button
          ref={previewTriggerRef}
          type="button"
          onClick={() => void showPreview()}
          disabled={previewLoading}
          aria-pressed={preview !== null}
          className="inline-flex items-center gap-2 rounded-md border border-ghana-green bg-white px-5 py-2.5 text-sm font-semibold text-ghana-green hover:bg-green-50 disabled:opacity-60"
        >
          <Eye aria-hidden="true" className="size-4" />
          {previewLoading ? "Voorbeeld laden…" : "Voorbeeld"}
        </button>
        <button
          ref={helpTriggerRef}
          type="button"
          onClick={() => {
            setPreview(null);
            setHelpOpen(true);
          }}
          aria-expanded={helpOpen}
          aria-controls="markdown-help-panel"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-ghana-green hover:text-ghana-green"
        >
          <CircleHelp aria-hidden="true" className="size-4" />
          Help
        </button>
        <Link
          href="/admin/newsletters"
          className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-ghana-green hover:text-ghana-green"
        >
          Terug naar overzicht
        </Link>
        {message ? <p className="text-sm font-medium text-green-700">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
      </div>
      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreview(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-preview-title"
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <header className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-4 border-b border-gray-200 px-5 py-4 sm:grid-cols-[1fr_auto_1fr]">
              <h2 id="newsletter-preview-title" className="text-lg font-semibold text-gray-900">
                Voorbeeld nieuwsbrief
              </h2>
              <div
                role="group"
                aria-label="Taal van het voorbeeld"
                className="order-3 col-span-2 grid grid-cols-2 rounded-md border border-gray-300 bg-gray-100 p-1 sm:order-0 sm:col-span-1"
              >
                {(["nl", "en"] as const).map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => setPreviewLocale(locale)}
                    aria-pressed={previewLocale === locale}
                    className={`h-8 w-14 rounded-sm text-xs font-semibold uppercase transition-colors ${
                      previewLocale === locale
                        ? "bg-ghana-green text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {locale}
                  </button>
                ))}
              </div>
              <button
                ref={previewCloseButtonRef}
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Voorbeeld sluiten"
                title="Sluiten"
                className="grid size-9 place-items-center justify-self-end rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>
            <div className="min-h-0 flex-1 bg-gray-100 p-3 sm:p-6">
              {previewLoading ? (
                <div className="grid h-[70vh] place-items-center text-sm text-gray-500">
                  E-mailvoorbeeld laden…
                </div>
              ) : (
                <iframe
                  key={previewLocale}
                  title={`E-mailvoorbeeld ${previewLocale.toUpperCase()}`}
                  srcDoc={preview[previewLocale]}
                  className="mx-auto h-[70vh] w-full max-w-3xl border border-gray-300 bg-white shadow-sm"
                />
              )}
            </div>
          </section>
        </div>
      ) : null}
      {helpOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setHelpOpen(false);
            }
          }}
        >
          <aside
            id="markdown-help-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="markdown-help-title"
            className="animate-help-slide-in absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="markdown-help-title" className="text-lg font-semibold text-gray-900">
                  Markdown-hulp
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Snelle voorbeelden voor de nieuwsbrief.
                </p>
              </div>
              <button
                ref={helpCloseButtonRef}
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Markdown-hulp sluiten"
                title="Sluiten"
                className="grid size-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>
            <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 text-sm text-gray-700">
              <section>
                <h3 className="font-semibold text-gray-900">YAML-frontmatter</h3>
                <p className="mt-1 text-gray-500">
                  Plaats dit blok bovenaan. Alleen de Nederlandse titel verschijnt in het overzicht.
                </p>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{`---
title: Oktober nieuwsbrief
subject: Nieuws uit Ghana
previewText: Lees onze laatste update
---`}</code>
                </pre>
              </section>
              <section>
                <h3 className="font-semibold text-gray-900">Koppen</h3>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{`# Hoofdtitel
## Tussenkop
### Kleine kop`}</code>
                </pre>
              </section>
              <section>
                <h3 className="font-semibold text-gray-900">Tekstmarkeringen</h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Vet</p>
                    <code className="mt-1 block bg-gray-100 px-3 py-2">**vetgedrukte tekst**</code>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cursief</p>
                    <code className="mt-1 block bg-gray-100 px-3 py-2">*cursieve tekst*</code>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Onderstreept</p>
                    <code className="mt-1 block bg-gray-100 px-3 py-2">
                      ++onderstreepte tekst++
                    </code>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gemarkeerd</p>
                    <code className="mt-1 block bg-gray-100 px-3 py-2">
                      :highlight[gemarkeerde tekst]
                    </code>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="font-semibold text-gray-900">Lijsten</h3>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{`- Eerste punt
- Tweede punt

1. Eerste stap
2. Tweede stap`}</code>
                </pre>
              </section>
              <section>
                <h3 className="font-semibold text-gray-900">Links en afbeeldingen</h3>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{`[Lees meer](https://pharma4ghana.com)

![Beschrijving](/images/voorbeeld.jpg)`}</code>
                </pre>
              </section>
              <section>
                <h3 className="font-semibold text-gray-900">Blogbericht invoegen</h3>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{`::blog{slug="educational-grant-first-round"}`}</code>
                </pre>
              </section>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
