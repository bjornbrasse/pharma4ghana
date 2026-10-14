"use client";

import { useAction } from "convex/react";
import { Plus, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { api } from "@convex/_generated/api";

export default function AddSubscriberDialog() {
  const addSubscriber = useAction(api.newsletterSubscription.addSubscriber);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [locale, setLocale] = useState<"nl" | "en">("nl");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    emailRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [open, saving]);

  function close() {
    if (!saving) {
      setOpen(false);
      setError(null);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await addSubscriber({
        email: email.trim(),
        name: name.trim() || undefined,
        locale,
      });
      setEmail("");
      setName("");
      setLocale("nl");
      setOpen(false);
    } catch {
      setError("Could not add the subscriber. Check the email address and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark"
      >
        <Plus aria-hidden="true" className="size-4" />
        Voeg abonnee toe
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-subscriber-title"
            className="w-full max-w-lg rounded-lg bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 id="add-subscriber-title" className="text-lg font-semibold text-gray-900">
                  Add subscriber
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  The subscriber receives a welcome email and must confirm the subscription.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                disabled={saving}
                aria-label="Close"
                title="Close"
                className="grid size-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>
            <form onSubmit={submit} className="space-y-5 p-5">
              <div>
                <label
                  htmlFor="subscriber-email"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Email address
                </label>
                <input
                  ref={emailRef}
                  id="subscriber-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/25"
                />
              </div>
              <div>
                <label
                  htmlFor="subscriber-name"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Name <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input
                  id="subscriber-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/25"
                />
              </div>
              <div>
                <label
                  htmlFor="subscriber-locale"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Language
                </label>
                <select
                  id="subscriber-locale"
                  value={locale}
                  onChange={(event) => setLocale(event.target.value === "en" ? "en" : "nl")}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-ghana-green focus:ring-2 focus:ring-ghana-green/25"
                >
                  <option value="nl">Dutch</option>
                  <option value="en">English</option>
                </select>
              </div>
              {error ? (
                <p role="alert" className="text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}
              <footer className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={close}
                  disabled={saving}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark disabled:opacity-60"
                >
                  {saving ? "Adding…" : "Add subscriber"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
