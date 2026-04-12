"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";

const PRESET_AMOUNTS = [10, 25, 50, 100] as const;

interface DonateFormProps {
  locale: string;
  enabled: boolean;
}

export default function DonateForm({ locale, enabled }: DonateFormProps) {
  const t = useTranslations("donate.form");
  const panel = useTranslations("donate.panel");
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function getAmount() {
    if (customAmount.trim()) {
      return Number(customAmount);
    }

    return selectedAmount;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const amount = getAmount();

    if (!Number.isFinite(amount) || amount < 5 || amount > 10000) {
      setError(t("validation"));
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/donations/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            locale,
          }),
        });

        const data = (await response.json()) as { error?: string; url?: string };

        if (!response.ok || !data.url) {
          throw new Error(data.error || t("genericError"));
        }

        window.location.assign(data.url);
      } catch {
        setError(t("genericError"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">{t("presetLabel")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESET_AMOUNTS.map((amount) => {
            const isSelected = !customAmount && selectedAmount === amount;

            return (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                  setError(null);
                }}
                className={[
                  "rounded-xl border px-4 py-3 text-base font-semibold transition-colors",
                  isSelected
                    ? "border-ghana-green bg-ghana-green text-white"
                    : "border-gray-200 bg-white text-gray-800 hover:border-ghana-green hover:text-ghana-green",
                ].join(" ")}
              >
                €{amount}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t("customLabel")}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
          <input
            type="number"
            min="5"
            max="10000"
            step="1"
            inputMode="decimal"
            value={customAmount}
            onChange={(event) => {
              setCustomAmount(event.target.value);
              setError(null);
            }}
            placeholder={t("customPlaceholder")}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-9 pr-4 text-base text-gray-900 outline-none transition-colors focus:border-ghana-green"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 border border-gray-100">
        <p className="font-medium text-gray-900 mb-1">{panel("secureTitle")}</p>
        <p>{panel("secureBody")}</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-ghana-red/20 bg-ghana-red/5 px-4 py-3 text-sm text-ghana-red">
          {error}
        </p>
      ) : null}

      {!enabled ? (
        <p className="rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          {panel("notConfigured")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!enabled || isPending}
        className="inline-flex w-full items-center justify-center rounded-xl bg-ghana-green px-6 py-4 text-base font-bold text-white transition-colors hover:bg-ghana-green-dark disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isPending ? t("processing") : t("submit")}
      </button>
    </form>
  );
}
