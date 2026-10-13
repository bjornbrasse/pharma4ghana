"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Heart,
  Laptop,
  LockKeyhole,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type SubmitEventHandler, useEffect, useRef, useState, useTransition } from "react";
import { donationOptions, type DonationPurpose } from "@/lib/donation-options";
import { donationCheckoutSchema, donationSchema, type DonationInput } from "@/lib/donation-schema";

const OPTIONS = [
  {
    key: "materials",
    amount: donationOptions.materials.amount,
    image: "/images/posts/books.jpeg",
    icon: BookOpen,
  },
  {
    key: "computer",
    amount: donationOptions.computer.amount,
    image: "/images/computer_AI2.png",
    icon: Laptop,
  },
  {
    key: "student",
    amount: donationOptions.student.amount,
    image: "/images/pharm_tech_student_AI.png",
    icon: GraduationCap,
  },
] as const;

type Frequency = DonationInput["frequency"];
type Selection = (typeof OPTIONS)[number]["amount"] | "custom" | null;

interface DonateFormProps {
  locale: string;
  enabled: boolean;
}

export default function DonateForm({ locale, enabled }: DonateFormProps) {
  const t = useTranslations("donate");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [selection, setSelection] = useState<Selection>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkoutDonation, setCheckoutDonation] = useState<DonationInput | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checkoutDonation) {
      return;
    }

    nameInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        setCheckoutDonation(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [checkoutDonation, isPending]);

  const selectedAmount =
    selection === "custom" ? Number(customAmount) : selection === null ? Number.NaN : selection;
  const periodLabel = frequency === "monthly" ? t("form.perMonth") : t("form.oneTime");
  const submitAmount = Number.isFinite(selectedAmount) ? selectedAmount : 0;
  const purpose: DonationPurpose | null =
    selection === "custom"
      ? "custom"
      : (OPTIONS.find((option) => option.amount === selection)?.key ?? null);
  const shouldPulse =
    enabled &&
    !isPending &&
    donationSchema.safeParse({ amount: selectedAmount, frequency, locale, purpose }).success;

  function selectFrequency(nextFrequency: Frequency) {
    setFrequency(nextFrequency);
    setError(null);
  }

  function selectAmount(nextSelection: Selection) {
    setSelection(nextSelection);
    if (nextSelection !== "custom") {
      setCustomAmount("");
    }
    setError(null);
  }

  function getSubmitLabel() {
    if (isPending) {
      return t("form.processing");
    }

    if (selection === null) {
      return t("form.submit.selectAmount");
    }

    if (selection === "custom" && customAmount === "") {
      return t("form.submit.enterAmount");
    }

    return t(`form.submit.${frequency}`, { amount: submitAmount });
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setError(null);

    const parsedDonation = donationSchema.safeParse({
      amount: selectedAmount,
      frequency,
      locale,
      purpose,
    });

    if (!parsedDonation.success) {
      setError(t("form.validation"));
      return;
    }

    setCheckoutError(null);
    setCheckoutDonation(parsedDonation.data);
  };

  const handleCheckoutSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setCheckoutError(null);

    if (!checkoutDonation) {
      return;
    }

    const parsedCheckout = donationCheckoutSchema.safeParse({
      ...checkoutDonation,
      donorName,
      donorEmail,
      confirmEmail,
      newsletterOptIn,
    });

    if (!parsedCheckout.success) {
      const emailMismatch = parsedCheckout.error.issues.some(
        (issue) => issue.path[0] === "confirmEmail",
      );
      setCheckoutError(t(emailMismatch ? "checkout.emailMismatch" : "checkout.validation"));
      return;
    }

    // Open during the click gesture, before awaiting the checkout request.
    const checkoutTab = window.open("about:blank", "_blank");
    if (!checkoutTab) {
      setCheckoutError(t("form.popupBlocked"));
      return;
    }
    checkoutTab.opener = null;

    startTransition(async () => {
      try {
        const response = await fetch("/api/donations/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedCheckout.data),
        });

        const data = (await response.json()) as { error?: string; url?: string };

        if (!response.ok || !data.url) {
          throw new Error(data.error || t("form.genericError"));
        }

        if (checkoutTab.closed) {
          throw new Error("The checkout tab was closed.");
        }
        checkoutTab.location.replace(data.url);
      } catch {
        checkoutTab.close();
        setCheckoutError(t("form.genericError"));
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <div
          className="relative grid grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1"
          aria-label={t("frequency.label")}
        >
          <span
            aria-hidden="true"
            data-testid="donation-frequency-highlight"
            className="pointer-events-none absolute inset-y-1 left-1 w-[calc((100%-0.75rem)/2)] rounded-xl bg-ghana-green shadow-sm transition-transform duration-300 ease-in-out motion-reduce:transition-none"
            style={{
              transform:
                frequency === "once" ? "translateX(calc(100% + 0.25rem))" : "translateX(0)",
            }}
          />
          {(["monthly", "once"] as const).map((value) => {
            const active = frequency === value;
            const Icon = value === "monthly" ? CalendarDays : Heart;

            return (
              <button
                key={value}
                type="button"
                onClick={() => selectFrequency(value)}
                className={[
                  "relative flex items-center justify-center gap-2 rounded-xl border-0 bg-transparent px-2 py-3 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghana-green motion-reduce:transition-none sm:gap-3 sm:px-4",
                  active ? "text-white" : "cursor-pointer text-slate-600 hover:text-ghana-green",
                ].join(" ")}
                aria-pressed={active}
              >
                <Icon className="size-6 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-bold">{t(`frequency.${value}.title`)}</span>
                  <span
                    className={`block text-xs transition-colors duration-300 motion-reduce:transition-none ${active ? "text-green-100" : "text-slate-500"}`}
                  >
                    {t(`frequency.${value}.subtitle`)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="px-1 pb-1 pt-5 sm:px-0">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {t(`form.heading.${frequency}`)}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("form.subtitle")}</p>
        </div>

        <fieldset className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <legend className="sr-only">{t("form.presetLabel")}</legend>
          {OPTIONS.map(({ key, amount, image, icon: Icon }) => {
            const selected = selection === amount;

            return (
              <label
                key={key}
                className={[
                  "relative flex cursor-pointer flex-col rounded-2xl border bg-white p-2 shadow-sm transition",
                  selected
                    ? "z-10 scale-[1.025] border-ghana-green shadow-xl shadow-ghana-green/15 ring-1 ring-ghana-green"
                    : "border-gray-200 hover:border-ghana-green/60",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="donation-amount"
                  value={amount}
                  checked={selected}
                  onChange={() => selectAmount(amount)}
                  className="sr-only"
                />
                <div className="relative h-28 overflow-hidden rounded-xl sm:h-32 lg:h-28">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 220px"
                    className={
                      key === "student" ? "object-cover object-[center_15%]" : "object-cover"
                    }
                  />
                  <span className="absolute bottom-2 left-2 grid size-9 place-items-center rounded-full bg-emerald-50 text-ghana-green shadow-sm">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  {selected ? (
                    <span className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-ghana-green text-sm font-bold text-white ring-2 ring-white">
                      ✓
                    </span>
                  ) : null}
                </div>
                <span className="mt-2 block text-sm font-extrabold text-slate-900">
                  {t(`options.${key}.title`)}
                </span>
                <span className="mt-0.5 min-h-12 text-xs leading-4 text-slate-500">
                  {t(`options.${key}.body`)}
                </span>
                <span
                  className={[
                    "mt-auto rounded-xl border px-2.5 py-2 text-sm font-bold",
                    selected
                      ? "border-emerald-100 bg-emerald-50 text-ghana-green"
                      : "border-gray-200 text-slate-700",
                  ].join(" ")}
                >
                  € {amount} <span className="text-xs font-medium">{periodLabel}</span>
                  <span className="block pl-0 text-[11px] font-normal text-slate-500">
                    {frequency === "monthly"
                      ? t("form.perYear", { amount: amount * 12 })
                      : t("form.directImpact")}
                  </span>
                </span>
              </label>
            );
          })}

          <label
            className={[
              "relative flex cursor-pointer flex-col rounded-2xl border bg-white p-2 shadow-sm transition",
              selection === "custom"
                ? "z-10 scale-[1.025] border-ghana-green shadow-xl shadow-ghana-green/15 ring-1 ring-ghana-green"
                : "border-gray-200 hover:border-ghana-green/60",
            ].join(" ")}
          >
            <input
              type="radio"
              name="donation-amount"
              value="custom"
              checked={selection === "custom"}
              onChange={() => selectAmount("custom")}
              className="sr-only"
            />
            <div className="relative grid h-28 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-200 via-lime-100 to-amber-200 sm:h-32 lg:h-28">
              <span className="grid size-14 place-items-center rounded-full bg-white text-ghana-green shadow-sm ring-1 ring-emerald-100">
                <HandHeart className="size-8" strokeWidth={1.7} aria-hidden="true" />
              </span>
              {selection === "custom" ? (
                <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-ghana-green text-sm font-bold text-white ring-2 ring-white">
                  ✓
                </span>
              ) : null}
            </div>
            <span className="mt-2 block text-sm font-extrabold text-slate-900">
              {t("options.custom.title")}
            </span>
            <span className="mt-0.5 min-h-12 text-xs leading-4 text-slate-500">
              {t("options.custom.body")}
            </span>
            {selection === "custom" ? (
              <div className="relative mt-auto">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
                  €
                </span>
                <input
                  id="custom-donation-amount"
                  type="number"
                  min="5"
                  max="1000"
                  step="1"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(event) => {
                    setCustomAmount(event.target.value);
                    setError(null);
                  }}
                  onClick={(event) => event.stopPropagation()}
                  placeholder={t("form.customPlaceholder")}
                  aria-label={t("form.customLabel")}
                  className="w-full rounded-xl border border-ghana-green bg-emerald-50 py-2 pl-7 pr-2 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-ghana-green/20"
                  autoFocus
                />
              </div>
            ) : (
              <span className="mt-auto rounded-xl border border-gray-200 px-2.5 py-2 text-sm font-bold text-slate-700">
                {t("form.otherAmount")}
                <span className="block text-[11px] font-normal text-slate-500">
                  {t("form.customRange")}
                </span>
              </span>
            )}
          </label>
        </fieldset>

        {error ? (
          <p
            role="alert"
            className="mx-auto mt-4 max-w-xl rounded-xl border border-ghana-red/20 bg-ghana-red/5 px-4 py-3 text-center text-sm text-ghana-red"
          >
            {error}
          </p>
        ) : null}

        {!enabled ? (
          <p className="mx-auto mt-4 max-w-xl rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-900">
            {t("panel.notConfigured")}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={selection === null || !enabled || isPending}
          className={[
            "mx-auto mt-5 flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-ghana-green px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-ghana-green-dark disabled:cursor-not-allowed disabled:bg-gray-400 hover:cursor-pointer",
            shouldPulse
              ? "motion-safe:animate-donation-pulse hover:animate-none focus-visible:animate-none"
              : "",
          ].join(" ")}
        >
          <Heart className="size-5" aria-hidden="true" />
          {getSubmitLabel()}
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </form>

      {checkoutDonation ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-xs"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setCheckoutDonation(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-checkout-title"
            className="relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5 pr-16">
              <p className="text-xs font-bold uppercase text-ghana-green">
                {t("checkout.eyebrow")}
              </p>
              <h2 id="donation-checkout-title" className="mt-1 text-2xl font-black text-slate-950">
                {t("checkout.title")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t("checkout.subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutDonation(null)}
              disabled={isPending}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-slate-600 transition hover:bg-white hover:text-slate-950 disabled:opacity-50"
              aria-label={t("checkout.close")}
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <form onSubmit={handleCheckoutSubmit} noValidate className="space-y-4 p-6">
              <label className="block text-sm font-bold text-slate-800">
                {t("checkout.name")}
                <input
                  ref={nameInputRef}
                  type="text"
                  autoComplete="name"
                  value={donorName}
                  onChange={(event) => setDonorName(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/15"
                  required
                />
              </label>
              <label className="block text-sm font-bold text-slate-800">
                {t("checkout.email")}
                <input
                  type="email"
                  autoComplete="email"
                  value={donorEmail}
                  onChange={(event) => setDonorEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/15"
                  required
                />
              </label>
              <label className="block text-sm font-bold text-slate-800">
                {t("checkout.confirmEmail")}
                <input
                  type="email"
                  autoComplete="email"
                  value={confirmEmail}
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3.5 py-3 font-normal outline-none transition focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/15"
                  required
                />
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                <input
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={(event) => setNewsletterOptIn(event.target.checked)}
                  className="mt-0.5 size-5 shrink-0 accent-ghana-green"
                />
                <span>
                  <span className="block text-sm font-bold text-slate-900">
                    {t("checkout.newsletterLabel")}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                    {t("checkout.newsletterDescription")}
                  </span>
                </span>
              </label>

              {checkoutError ? (
                <p
                  role="alert"
                  className="rounded-md border border-ghana-red/20 bg-ghana-red/5 px-4 py-3 text-sm text-ghana-red"
                >
                  {checkoutError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ghana-green px-5 py-3.5 text-sm font-bold text-white transition hover:bg-ghana-green-dark disabled:cursor-wait disabled:bg-slate-400"
              >
                <LockKeyhole className="size-4" aria-hidden="true" />
                {isPending ? t("form.processing") : t("checkout.continue")}
                {!isPending ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
