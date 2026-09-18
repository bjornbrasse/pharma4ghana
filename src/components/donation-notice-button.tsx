"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { paymentFunctionAvailable } from "@/lib/payment-config";

interface DonationNoticeButtonProps {
  children: React.ReactNode;
  className: string;
  unavailableClassName?: string;
  locale?: string;
  onOpen?: () => void;
}

interface NoticePosition {
  left: number;
  top: number;
  width: number;
}

export default function DonationNoticeButton({
  children,
  className,
  unavailableClassName,
  locale,
  onOpen,
}: DonationNoticeButtonProps) {
  const t = useTranslations("nav");
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<NoticePosition | null>(null);

  function openNotice(event: React.MouseEvent<HTMLButtonElement>) {
    const trigger = event.currentTarget.getBoundingClientRect();
    const viewportMargin = 16;
    const noticeWidth = Math.min(448, window.innerWidth - viewportMargin * 2);
    const centeredLeft = trigger.left + trigger.width / 2 - noticeWidth / 2;
    const left = Math.min(
      Math.max(viewportMargin, centeredLeft),
      window.innerWidth - noticeWidth - viewportMargin,
    );
    const estimatedNoticeHeight = 200;
    const top =
      window.innerHeight - trigger.bottom >= estimatedNoticeHeight
        ? trigger.bottom + 8
        : Math.max(viewportMargin, trigger.top - estimatedNoticeHeight - 8);

    setPosition({ left, top, width: noticeWidth });
    onOpen?.();
    setOpen(true);
  }

  if (paymentFunctionAvailable) {
    return (
      <Link href="/donate" locale={locale} onClick={onOpen} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-disabled="true"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openNotice}
        className={unavailableClassName ?? className}
      >
        {children}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          style={position ?? undefined}
          className="fixed z-60 rounded-sm border border-gray-200 bg-white p-6 text-left shadow-xl"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            aria-label={t("donateNoticeClose")}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <h2 id={titleId} className="pr-8 text-lg font-bold text-gray-900">
            {t("donateNoticeTitle")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {t("donateNoticeBody")}
            <a
              href="mailto:sponsors@pharma4ghana.com"
              className="mt-4 block text-lg font-semibold text-ghana-green underline underline-offset-2"
            >
              sponsors@pharma4ghana.com
            </a>
          </p>
        </div>
      ) : null}
    </>
  );
}
