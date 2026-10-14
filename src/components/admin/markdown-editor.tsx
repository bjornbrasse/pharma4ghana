"use client";

import { useRef, useState } from "react";
import type { Id } from "@convex/_generated/dataModel";
import ImageSelector from "./image-selector";
import MarkdownHelpSidebar from "./markdown-help-sidebar";

type MarkdownEditorProps = {
  contentNl: string;
  contentEn: string;
  onContentNlChange: (content: string) => void;
  onContentEnChange: (content: string) => void;
};

function ScrollMirror({ content }: { content: string }) {
  return content.split("\n").map((line, index) => (
    <span
      key={index}
      data-scroll-heading={/^#{1,6}(?:\s|$)/.test(line) ? "" : undefined}
      className="block min-h-6"
    >
      {line || "\u200b"}
    </span>
  ));
}

function getHeadingOffsets(mirror: HTMLDivElement, maxScroll: number) {
  return Array.from(mirror.querySelectorAll<HTMLElement>("[data-scroll-heading]"), (heading) =>
    Math.min(heading.offsetTop, maxScroll),
  );
}

function getSyncedScrollTop(
  source: HTMLTextAreaElement,
  target: HTMLTextAreaElement,
  sourceMirror: HTMLDivElement,
  targetMirror: HTMLDivElement,
) {
  const sourceMax = Math.max(0, source.scrollHeight - source.clientHeight);
  const targetMax = Math.max(0, target.scrollHeight - target.clientHeight);
  if (sourceMax === 0 || targetMax === 0) return 0;

  const sourceHeadings = getHeadingOffsets(sourceMirror, sourceMax);
  const targetHeadings = getHeadingOffsets(targetMirror, targetMax);
  const headingCount = Math.min(sourceHeadings.length, targetHeadings.length);
  const anchors = [{ source: 0, target: 0 }];

  for (let index = 0; index < headingCount; index += 1) {
    const sourceOffset = sourceHeadings[index];
    if (sourceOffset > anchors.at(-1)!.source) {
      anchors.push({ source: sourceOffset, target: targetHeadings[index] });
    }
  }

  if (sourceMax > anchors.at(-1)!.source) {
    anchors.push({ source: sourceMax, target: targetMax });
  }

  const nextIndex = anchors.findIndex((anchor) => anchor.source >= source.scrollTop);
  if (nextIndex <= 0) return anchors[0].target;
  if (nextIndex === -1) return targetMax;

  const previous = anchors[nextIndex - 1];
  const next = anchors[nextIndex];
  const progress = (source.scrollTop - previous.source) / (next.source - previous.source);
  return previous.target + (next.target - previous.target) * progress;
}

export default function MarkdownEditor({
  contentNl,
  contentEn,
  onContentNlChange,
  onContentEnChange,
}: MarkdownEditorProps) {
  const contentNlRef = useRef<HTMLTextAreaElement | null>(null);
  const contentEnRef = useRef<HTMLTextAreaElement | null>(null);
  const mirrorNlRef = useRef<HTMLDivElement | null>(null);
  const mirrorEnRef = useRef<HTMLDivElement | null>(null);
  const syncingScrollRef = useRef(false);
  const [activeLocale, setActiveLocale] = useState<"nl" | "en">("nl");

  function syncScroll(sourceLocale: "nl" | "en") {
    if (syncingScrollRef.current) return;

    const source = sourceLocale === "nl" ? contentNlRef.current : contentEnRef.current;
    const target = sourceLocale === "nl" ? contentEnRef.current : contentNlRef.current;
    const sourceMirror = sourceLocale === "nl" ? mirrorNlRef.current : mirrorEnRef.current;
    const targetMirror = sourceLocale === "nl" ? mirrorEnRef.current : mirrorNlRef.current;
    if (!source || !target || !sourceMirror || !targetMirror) return;

    syncingScrollRef.current = true;
    target.scrollTop = getSyncedScrollTop(source, target, sourceMirror, targetMirror);
    requestAnimationFrame(() => {
      syncingScrollRef.current = false;
    });
  }

  function insertImage(imageId: Id<"image">) {
    const isDutch = activeLocale === "nl";
    const textarea = isDutch ? contentNlRef.current : contentEnRef.current;
    const content = isDutch ? contentNl : contentEn;
    const onChange = isDutch ? onContentNlChange : onContentEnChange;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? start;
    const directive = `\n\n::image[${imageId}]\n\n`;
    onChange(`${content.slice(0, start)}${directive}${content.slice(end)}`);

    requestAnimationFrame(() => {
      const cursor = start + directive.length;
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div>
          <label
            htmlFor="message-content-nl"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Nederlands
          </label>
          <div className="relative">
            <textarea
              ref={contentNlRef}
              id="message-content-nl"
              value={contentNl}
              onChange={(event) => onContentNlChange(event.target.value)}
              onFocus={() => setActiveLocale("nl")}
              onScroll={() => syncScroll("nl")}
              spellCheck={false}
              className="min-h-[60vh] w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
            />
            <div
              ref={mirrorNlRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-x-0 top-0 whitespace-pre-wrap wrap-break-word border border-transparent p-4 font-mono text-sm leading-6"
            >
              <ScrollMirror content={contentNl} />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="message-content-en"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Engels
          </label>
          <div className="relative">
            <textarea
              ref={contentEnRef}
              id="message-content-en"
              value={contentEn}
              onChange={(event) => onContentEnChange(event.target.value)}
              onFocus={() => setActiveLocale("en")}
              onScroll={() => syncScroll("en")}
              spellCheck={false}
              className="min-h-[60vh] w-full resize-y rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm leading-6 text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
            />
            <div
              ref={mirrorEnRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-x-0 top-0 whitespace-pre-wrap wrap-break-word border border-transparent p-4 font-mono text-sm leading-6"
            >
              <ScrollMirror content={contentEn} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <ImageSelector compact onChange={insertImage} />
        <MarkdownHelpSidebar mode="message" />
      </div>
    </div>
  );
}
