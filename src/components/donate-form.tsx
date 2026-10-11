"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Heart,
  Laptop,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type SubmitEventHandler, useState, useTransition } from "react";
import { donationOptions, type DonationPurpose } from "@/lib/donation-options";
import { donationSchema, type DonationInput } from "@/lib/donation-schema";

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
    image: "/images/computer_AI.png",
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
  const [isPending, startTransition] = useTransition();

  const selectedAmount =
    selection === "custom" ? Number(customAmount) : selection === null ? Number.NaN : selection;
  const periodLabel = frequency === "monthly" ? t("form.perMonth") : t("form.oneTime");
  const submitAmount = Number.isFinite(selectedAmount) ? selectedAmount : 0;
  const purpose: DonationPurpose | null =
    selection === "custom"
      ? "custom"
      : (OPTIONS.find((option) => option.amount === selection)?.key ?? null);

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

    console.log("🚀 ~ handleSubmit ~ selectedAmount:", selectedAmount);

    const parsedDonation = donationSchema.safeParse({
      amount: selectedAmount,
      frequency,
      locale,
      purpose,
    });
    console.log("🚀 ~ handleSubmit ~ parsedDonation:", parsedDonation);

    if (!parsedDonation.success) {
      setError(t("form.validation"));
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/donations/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedDonation.data),
        });

        const data = (await response.json()) as { error?: string; url?: string };

        if (!response.ok || !data.url) {
          throw new Error(data.error || t("form.genericError"));
        }

        window.location.assign(data.url);
      } catch {
        setError(t("form.genericError"));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className="grid gap-1 rounded-2xl border border-gray-200 bg-gray-50 p-1 sm:grid-cols-2"
        aria-label={t("frequency.label")}
      >
        {(["monthly", "once"] as const).map((value) => {
          const active = frequency === value;
          const Icon = value === "monthly" ? CalendarDays : Heart;

          return (
            <button
              key={value}
              type="button"
              onClick={() => selectFrequency(value)}
              className={[
                "flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                active
                  ? "bg-ghana-green text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-ghana-green",
              ].join(" ")}
              aria-pressed={active}
            >
              <Icon className="size-6 shrink-0" aria-hidden="true" />
              <span>
                <span className="block text-sm font-bold">{t(`frequency.${value}.title`)}</span>
                <span className={`block text-xs ${active ? "text-green-100" : "text-slate-500"}`}>
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
        className="mx-auto mt-5 flex w-full max-w-sm items-center justify-center gap-3 rounded-full bg-ghana-green px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-ghana-green-dark disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        <Heart className="size-5" aria-hidden="true" />
        {getSubmitLabel()}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
