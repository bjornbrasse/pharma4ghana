"use client";

import { Download, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface ReceiptLeaveGuardProps {
  downloadUrl: string;
}

export default function ReceiptLeaveGuard({ downloadUrl }: ReceiptLeaveGuardProps) {
  const t = useTranslations("donate.successPage.leaveWarning");
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const receiptHandled = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const absoluteDownloadUrl = new URL(downloadUrl, window.location.href).href;

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        receiptHandled.current
      ) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");

      if (!link || link.target === "_blank") {
        return;
      }

      if (link.href === absoluteDownloadUrl) {
        receiptHandled.current = true;
        return;
      }

      if (link.href === window.location.href || link.href.startsWith("mailto:")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setPendingUrl(link.href);
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!receiptHandled.current) {
        event.preventDefault();
      }
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [downloadUrl]);

  useEffect(() => {
    if (pendingUrl) {
      closeButtonRef.current?.focus();
    }
  }, [pendingUrl]);

  function leavePage() {
    if (!pendingUrl) {
      return;
    }

    receiptHandled.current = true;
    window.location.assign(pendingUrl);
  }

  function downloadAndLeave() {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
    leavePage();
  }

  if (!pendingUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-leave-warning-title"
        aria-describedby="receipt-leave-warning-description"
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setPendingUrl(null)}
          className="absolute top-3 right-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label={t("close")}
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <h2 id="receipt-leave-warning-title" className="pr-8 text-xl font-bold text-gray-900">
          {t("title")}
        </h2>
        <p id="receipt-leave-warning-description" className="mt-3 text-sm leading-6 text-gray-600">
          {t("body")}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={downloadAndLeave}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-ghana-gold px-5 py-3 text-sm font-bold text-ghana-green hover:bg-ghana-gold-dark"
          >
            <Download className="size-4" aria-hidden="true" />
            {t("download")}
          </button>
          <button
            type="button"
            onClick={leavePage}
            className="rounded-md border border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            {t("decline")}
          </button>
        </div>
      </div>
    </div>
  );
}