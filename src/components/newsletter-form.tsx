"use client";

import Script from "next/script";
import { SubmitEvent, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          // theme?: "light" | "dark" | "auto";
          appearance?: "interaction-only";
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const widgetId = useRef<string | null>(null);

  function renderTurnstile() {
    if (!window.turnstile || widgetId.current) return;

    widgetId.current = window.turnstile.render("#newsletter-turnstile", {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      appearance: "interaction-only",

      callback(token) {
        setTurnstileToken(token);
      },

      "expired-callback"() {
        setTurnstileToken(null);
      },

      "error-callback"() {
        setTurnstileToken(null);
      },
    });
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!turnstileToken) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");

      // Turnstile tokens can only be successfully validated once,
      // so obtain a fresh token for another attempt.
      setTurnstileToken(null);

      if (widgetId.current) {
        window.turnstile?.reset(widgetId.current);
      }
    }
  }

  if (status === "success") {
    return <p>Check your inbox to confirm your newsletter subscription.</p>;
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />

      <form onSubmit={handleSubmit} className="w-full border border-ghana-green p-12 rounded-md">
        <div className="flex items-center gap-8">
          <label htmlFor="newsletter-email" className="shrink-0">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="text"
            inputMode="decimal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            // placeholder={t("customPlaceholder")}
            placeholder="Enter your email"
            className="max-w-4xl rounded-xl border border-gray-300 bg-white py-3 pl-9 pr-4 text-base text-gray-900 outline-none transition-colors focus:border-ghana-green"
          />
        </div>

        <div className="flex">
          <div id="newsletter-turnstile" />
          <button
            type="submit"
            disabled={status === "submitting" || !turnstileToken}
            className="px-6 py-3 rounded-lg bg-ghana-gold text-gray-900 font-semibold hover:bg-yellow-300 transition-colors"
          >
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        </div>

        {status === "error" && <p role="alert">Something went wrong. Please try again.</p>}
      </form>
    </>
  );
}
