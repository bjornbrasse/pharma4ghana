"use client";

import {
  submitContactForm,
  type ContactFormState,
} from "@/app/[locale]/contact/actions";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

const initialState: ContactFormState = {
  status: "idle",
};

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="bg-ghana-green/10 border border-ghana-green/30 rounded-xl p-8 text-center">
        <svg
          className="w-12 h-12 text-ghana-green mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-ghana-green font-semibold text-lg">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("name")}
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder={t("namePlaceholder")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ghana-green/40 focus:border-ghana-green text-sm transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder={t("emailPlaceholder")}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ghana-green/40 focus:border-ghana-green text-sm transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t("subject")}
        </label>
        <input
          type="text"
          name="subject"
          required
          placeholder={t("subjectPlaceholder")}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ghana-green/40 focus:border-ghana-green text-sm transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {t("message")}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ghana-green/40 focus:border-ghana-green text-sm transition-colors resize-none"
        />
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-red-700">{t("error")}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-ghana-green text-white font-semibold hover:bg-ghana-green-dark transition-colors"
      >
        {isPending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
