/**
 * Events data layer. Seeded with the real events from the design spec.
 * TODO: swap the bodies of getEvents/getEvent for Sanity queries
 * (src/sanity/lib) once the event schema is populated; keep the Event shape.
 * Unknown fields are intentionally left undefined, never invented.
 */
export interface EventImage {
  src: string;
  alt: string;
  /** Intrinsic size; used to reserve space. Defaults to 4:5 for figures. */
  width?: number;
  height?: number;
  caption?: string;
  /** e.g. "Photo: Jane Doe" */
  credit?: string;
}

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
  /** Full-bleed image behind the title card. Without it the hero uses a solid color. */
  coverImage?: { src: string; alt: string };
  /** Captioned images shown in the left column beside the article. */
  figures?: EventImage[];
  /** Thumbnail mosaic shown after the article. */
  gallery?: EventImage[];
  /** Pull-out text such as a poem or quote. */
  highlight?: { intro?: string; title: string; lines: string[] };
}

const EVENTS: Event[] = [
  {
    slug: "great-elephant-migration",
    title: "Great Elephant Migration",
    type: "Exhibition",
    year: 2026,
    location: "Livermore, CA",
    venue: "Bankhead Theater and Stockmen’s Park",
    startDate: "2026-10-10",
    endDate: "2026-12-06",
    dateLabel: "October 10 – December 6, 2026",
    summary:
      "Draped in Heritage: member artists create original works of art draped over the elephants at key events during the exhibition.",
    description: [
      "IAAA’s Draped in Heritage program brings together member artists to create original works of art draped over the elephants at key events during the Great Elephant Migration exhibition in Livermore.",
      "We draw on Indian artistic traditions — kalamkari, block print, batik, embroidery — and modern techniques and materials — upcycled fabrics, 3D printing etc., and weave in themes of conservation and coexistence. Our work will reach thousands of visitors in person in Livermore — and hundreds of thousands more across the globe through extensive media coverage of the exhibition.",
    ],
    highlight: {
      intro: "In the words of one of our members:",
      title: "Jumbo (Haiku) — By Majella Pinto",
      lines: ["Thriving pachyderms", "Reclaim space, food and freedom", "Declaring cease-fire."],
    },
  },
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
