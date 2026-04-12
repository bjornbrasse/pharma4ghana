export type EventType = "scholarship" | "event" | "workshop" | "deadline";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  type: EventType;
  location: string;
}

export const events: CalendarEvent[] = [
  {
    id: "scholarship-open-2026",
    title: "Scholarship Applications Open",
    description:
      "Applications for the 2026–2027 Pharma4Ghana scholarship programme open. Students enrolled in pharmacy or health sciences at accredited Ghanaian universities are eligible to apply.",
    date: "2026-05-01",
    type: "scholarship",
    location: "Online",
  },
  {
    id: "workshop-pharm-sciences-2026",
    title: "Student Workshop: Pharmaceutical Sciences",
    description:
      "A two-day workshop for scholarship recipients covering clinical pharmacology, drug dispensing practices, and patient consultation skills. Led by Dutch and Ghanaian pharmacists.",
    date: "2026-05-25",
    type: "workshop",
    location: "University of Ghana, Accra",
  },
  {
    id: "fundraiser-gala-2026",
    title: "Annual Fundraiser Gala 2026",
    description:
      "Join us for our annual fundraising gala in Amsterdam. An evening of networking, cultural exchange, and support for Ghanaian students. Black tie optional.",
    date: "2026-06-07",
    type: "event",
    location: "Amsterdam, Netherlands",
  },
  {
    id: "scholarship-deadline-2026",
    title: "Scholarship Application Deadline",
    description:
      "The deadline for the 2026–2027 scholarship cycle. All required documents must be submitted via the online portal by 23:59 GMT.",
    date: "2026-06-30",
    type: "deadline",
    location: "Online",
  },
  {
    id: "campus-visit-knust-2026",
    title: "Campus Visit — KNUST Kumasi",
    description:
      "Foundation representatives visit Kwame Nkrumah University of Science and Technology (KNUST) to meet current scholars, assess laboratory needs, and deliver donated materials.",
    date: "2026-07-15",
    type: "event",
    location: "KNUST, Kumasi, Ghana",
  },
  {
    id: "annual-report-2025",
    title: "Annual Report 2025 Released",
    description:
      "Publication of the Pharma4Ghana Annual Report for 2025, covering financials, scholar outcomes, and programme highlights. Available for download on our website.",
    date: "2026-02-15",
    type: "event",
    location: "Online",
  },
  {
    id: "scholarship-ceremony-2025",
    title: "2025 Scholarship Award Ceremony",
    description:
      "Recognition ceremony for the 2025 cohort of Pharma4Ghana scholars. Held at the University of Ghana's School of Pharmacy, Legon campus.",
    date: "2025-12-10",
    type: "scholarship",
    location: "University of Ghana, Legon",
  },
  {
    id: "partner-meeting-2026",
    title: "Partners & Donors Meeting",
    description:
      "Bi-annual meeting with institutional partners and major donors to review programme progress, set strategic priorities, and explore new collaboration opportunities.",
    date: "2026-03-05",
    type: "event",
    location: "Rotterdam, Netherlands",
  },
];
