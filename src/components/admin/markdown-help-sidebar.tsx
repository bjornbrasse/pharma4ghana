"use client";

import { CircleHelp, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type MarkdownHelpSidebarProps = {
  mode: "message" | "newsletter";
};

const yamlExamples = {
  message: `---
title: Titel van het bericht
author: Naam van de auteur
synopsis: Korte samenvatting
---`,
  newsletter: `---
title: Oktober nieuwsbrief
subject: Nieuws uit Ghana
previewText: Lees onze laatste update
---`,
};

export default function MarkdownHelpSidebar({ mode }: MarkdownHelpSidebarProps) {
  const titleId = useId();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-ghana-green hover:text-ghana-green"
      >
        <CircleHelp aria-hidden="true" className="size-4" />
        Help
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <aside
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="animate-help-slide-in absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                  Markdown-hulp
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Snelle voorbeelden voor {mode === "message" ? "je bericht" : "de nieuwsbrief"}.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
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
                  {mode === "message"
                    ? "Plaats dit blok bovenaan ieder bericht."
                    : "Plaats dit blok bovenaan. Alleen de Nederlandse titel verschijnt in het overzicht."}
                </p>
                <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                  <code>{yamlExamples[mode]}</code>
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
                  <code className="block bg-gray-100 px-3 py-2">**vetgedrukte tekst**</code>
                  <code className="block bg-gray-100 px-3 py-2">*cursieve tekst*</code>
                  <code className="block bg-gray-100 px-3 py-2">++onderstreepte tekst++</code>
                  <code className="block bg-gray-100 px-3 py-2">:highlight[gemarkeerde tekst]</code>
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

::image[convex-image-id]`}</code>
                </pre>
              </section>
              {mode === "newsletter" ? (
                <section>
                  <h3 className="font-semibold text-gray-900">Blogbericht invoegen</h3>
                  <pre className="mt-3 overflow-x-auto bg-gray-950 p-4 text-xs leading-6 text-gray-100">
                    <code>{`::blog{slug="educational-grant-first-round"}`}</code>
                  </pre>
                </section>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
