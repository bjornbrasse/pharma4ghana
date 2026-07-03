"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/ghana", label: t("ghana") },
    { href: "/about", label: t("about") },
    { href: "/messages", label: t("messages") },
    { href: "/contact", label: t("contact") },
  ];

  const otherLocale = locale === "en" ? "nl" : "en";
  const otherLocaleLabel = locale === "en" ? "NL" : "EN";

  const otherLocaleFlag =
    otherLocale === "nl" ? (
      <svg
        aria-hidden="true"
        viewBox="0 0 18 12"
        className="h-3.5 w-5.25 scale-125 rounded-sm border border-gray-300"
      >
        <rect width="18" height="4" fill="#AE1C28" />
        <rect y="4" width="18" height="4" fill="#FFFFFF" />
        <rect y="8" width="18" height="4" fill="#21468B" />
      </svg>
    ) : (
      <svg
        aria-hidden="true"
        viewBox="0 0 18 12"
        className="h-3.5 w-5.25 scale-125 rounded-sm border border-gray-300"
      >
        <rect width="18" height="12" fill="#012169" />
        <polygon points="0,0 2,0 18,10 18,12 16,12 0,2" fill="#FFFFFF" />
        <polygon points="18,0 16,0 0,10 0,12 2,12 18,2" fill="#FFFFFF" />
        <polygon points="0,0 1,0 18,11 18,12 17,12 0,1" fill="#C8102E" />
        <polygon points="18,0 17,0 0,11 0,12 1,12 18,1" fill="#C8102E" />
        <rect x="7" width="4" height="12" fill="#FFFFFF" />
        <rect y="4" width="18" height="4" fill="#FFFFFF" />
        <rect x="7.6" width="2.8" height="12" fill="#C8102E" />
        <rect y="4.6" width="18" height="2.8" fill="#C8102E" />
      </svg>
    );

  function handleLocaleSwitch() {
    router.replace(pathname, { locale: otherLocale, scroll: false });
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo-cropped.jpg"
              alt="Pharma4Ghana"
              width={180}
              height={198}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "text-ghana-green bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-ghana-green hover:bg-green-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <button
              onClick={handleLocaleSwitch}
              className="text-sm font-semibold px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:border-ghana-green hover:text-ghana-green transition-colors"
              aria-label={`Switch to ${otherLocaleLabel}`}
            >
              <span className="inline-flex items-center gap-1.5">
                {otherLocaleFlag}
                <span>{otherLocaleLabel}</span>
              </span>
            </button>

            {/* Donate button (desktop) */}
            <Link
              href="/donate"
              className="hidden md:inline-flex items-center px-6 py-2 text-sm font-semibold rounded-md bg-ghana-green text-white hover:bg-ghana-green-dark transition-colors"
            >
              {t("donateButton")}
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-gray-100 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "text-ghana-green bg-green-50 font-semibold"
                      : "text-gray-600 hover:text-ghana-green hover:bg-green-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 px-6 py-2 text-sm font-semibold rounded-md bg-ghana-green text-white text-center hover:bg-ghana-green-dark transition-colors"
            >
              {t("donateButton")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
