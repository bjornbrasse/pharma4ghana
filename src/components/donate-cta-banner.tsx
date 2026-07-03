import { HeartHandshakeIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DonateCtaBanner({
  locale,
  title,
  body,
  ctaLabel,
}: {
  locale: string;
  title: string;
  body: string;
  ctaLabel: string;
}) {
  return (
    <section className="rounded-[2rem] bg-ghana-green px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-ghana-gold">
            <HeartHandshakeIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-green-100 sm:text-base">
            {body}
          </p>
        </div>

        <Link
          href="/donate"
          locale={locale}
          className="inline-flex items-center justify-center rounded-full bg-ghana-gold px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-300"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}