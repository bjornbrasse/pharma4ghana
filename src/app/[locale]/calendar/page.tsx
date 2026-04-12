import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { events, type CalendarEvent, type EventType } from "@/data/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendar.hero" });
  return { title: t("title") };
}

const TODAY = new Date("2026-04-12");

const TYPE_STYLES: Record<EventType, { label: string; classes: string }> & Record<string, { label: string; classes: string }> = {
  scholarship: { label: "", classes: "bg-ghana-green/10 text-ghana-green border-ghana-green/20" },
  event: { label: "", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  workshop: { label: "", classes: "bg-ghana-gold/20 text-yellow-700 border-yellow-200" },
  deadline: { label: "", classes: "bg-ghana-red/10 text-ghana-red border-ghana-red/20" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function EventCard({
  event,
  typeLabel,
  locationLabel,
}: {
  event: CalendarEvent;
  typeLabel: string;
  locationLabel: string;
}) {
  const style = TYPE_STYLES[event.type];
  const eventDate = new Date(event.date);
  const isPast = eventDate < TODAY;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-6 flex gap-6 ${isPast ? "opacity-70" : ""}`}
    >
      {/* Date block */}
      <div className="shrink-0 flex flex-col items-center justify-start w-16">
        <div className="bg-ghana-green rounded-xl w-16 py-3 text-center">
          <span className="block text-ghana-gold text-xs font-bold uppercase tracking-wide">
            {new Date(event.date).toLocaleString("en-GB", { month: "short" })}
          </span>
          <span className="block text-white text-2xl font-bold leading-tight">
            {new Date(event.date).getDate()}
          </span>
          <span className="block text-green-200 text-xs">
            {new Date(event.date).getFullYear()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.classes}`}
          >
            {typeLabel}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {event.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            {locationLabel}: {event.location}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "calendar" });

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const upcoming = sorted.filter((e) => new Date(e.date) >= TODAY);
  const past = sorted
    .filter((e) => new Date(e.date) < TODAY)
    .reverse();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-ghana-green py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Events ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-14">
          {/* Upcoming */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-ghana-green inline-block" />
              {t("upcoming")}
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("noUpcoming")}</p>
            ) : (
              <div className="space-y-4">
                {upcoming.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    typeLabel={t(`types.${event.type}`)}
                    locationLabel={t("location")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
              {t("past")}
            </h2>
            {past.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("noPast")}</p>
            ) : (
              <div className="space-y-4">
                {past.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    typeLabel={t(`types.${event.type}`)}
                    locationLabel={t("location")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
