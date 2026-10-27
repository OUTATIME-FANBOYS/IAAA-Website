/**
 * Events data layer. Seeded with the real events from the design spec.
 * TODO: swap the bodies of getEvents/getEvent for Sanity queries
 * (src/sanity/lib) once the event schema is populated; keep the Event shape.
 * Unknown fields are intentionally left undefined, never invented.
 */
export interface Event {
  slug: string;
  title: string;
  /** Plain-text type label, e.g. "Artist’s Retreat" (no coloured chips). */
  type: string;
  year: number;
  location?: string;
  /** ISO dates (YYYY-MM-DD) when known. */
  startDate?: string;
  endDate?: string;
  /** Human display date; falls back to the year. */
  dateLabel?: string;
  venue?: string;
  address?: string;
  summary?: string;
  description?: string[];
  schedule?: { label: string; value: string }[];
}

const EVENTS: Event[] = [
  {
    slug: "2026-artist-retreat",
    title: "2026 Artist’s Retreat",
    type: "Artist’s Retreat",
    year: 2026,
    location: "Sausalito, CA",
  },
  {
    slug: "2025-artist-retreat",
    title: "2025 Artist’s Retreat",
    type: "Artist’s Retreat",
    year: 2025,
    location: "Florence, AL",
  },
];

function sortEvents(list: Event[]): Event[] {
  return [...list].sort(
    (a, b) =>
      (b.startDate ?? `${b.year}`).localeCompare(a.startDate ?? `${a.year}`),
  );
}

export async function getEvents(): Promise<Event[]> {
  return sortEvents(EVENTS);
}

export async function getEvent(slug: string): Promise<Event | null> {
  return EVENTS.find((e) => e.slug === slug) ?? null;
}

export function eventDate(e: Event): string {
  return e.dateLabel ?? String(e.year);
}

/** Google Calendar link; only possible when a start date is known. */
export function googleCalendarUrl(e: Event): string | null {
  if (!e.startDate) return null;
  const fmt = (d: string) => d.replaceAll("-", "");
  const end = e.endDate ?? e.startDate;
  // All-day events use an exclusive end date.
  const endExclusive = new Date(`${end}T00:00:00Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const endStr = endExclusive.toISOString().slice(0, 10);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${fmt(e.startDate)}/${fmt(endStr)}`,
    location: [e.venue, e.address ?? e.location].filter(Boolean).join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
