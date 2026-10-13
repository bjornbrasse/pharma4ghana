"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type NavItem = { href: string; label: string };
type NavSection = { label: string; items: NavItem[] };

const navSections: NavSection[] = [
  { label: "Donations", items: [{ href: "/admin/donations", label: "Donations" }] },
  {
    label: "Messages",
    items: [
      { href: "/admin/messages", label: "Contact messages" },
      { href: "/admin/posts", label: "News posts" },
    ],
  },
  {
    label: "Newsletter",
    items: [
      { href: "/admin/newsletters", label: "Newsletters" },
      { href: "/admin/subscribers", label: "Subscribers" },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.replace("/admin/sign-in");
    router.refresh();
  }

  return (
    <aside className="flex flex-col border-b border-ghana-green-dark bg-ghana-green text-white md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex items-center gap-3 px-5 py-5">
        <Image
          src="/images/logo.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded bg-white object-contain p-0.5"
        />
        <div>
          <p className="font-bold leading-tight">Pharma4Ghana</p>
          <p className="text-xs uppercase tracking-wider text-ghana-gold">Admin</p>
        </div>
      </div>

      <nav aria-label="Admin" className="flex-1 px-3 pb-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-green-200">
              {section.label}
            </p>
            <ul>
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-white text-ghana-green"
                          : "text-white hover:bg-ghana-green-light"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-ghana-green-light px-5 py-4 text-sm">
        <Link href="/" className="text-green-100 hover:text-white">
          ← Back to website
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="text-left text-green-100 hover:text-white disabled:opacity-60"
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
