/** Events data access. All event content comes from Sanity. */
import { safeFetch } from "@/sanity/lib/fetch";
import { imageProps } from "@/sanity/lib/image";
import { EVENTS_QUERY, EVENT_QUERY } from "@/sanity/lib/queries";
import { blocksToParagraphs } from "@/sanity/lib/text";

export interface EventImage {
  src: string;
  /** Large version for the image overlay. */
  fullSrc?: string;
  alt: string;
  /** Intrinsic size; used to reserve space. Defaults to 4:5 for figures. */
  width?: number;
  height?: number;
  caption?: string;
  /** e.g. "Photo: Jane Doe" */
  credit?: string;
}

export interface EventArtwork {
  id: string;
  title?: string;
  artist?: string;
  artistSlug?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  image: { src: string; alt: string };
  fullSrc?: string;
}

export interface Event {
  slug: string;
  title: string;
  /** Type label, e.g. "Artist’s Retreat". */
  type: string;
  year?: number;
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
  /** Artworks shown in the event. */
  artworks?: EventArtwork[];
  /** Pull-out text such as a poem or quote. */
  highlight?: { intro?: string; title: string; lines: string[] };
}

type Img = Parameters<typeof imageProps>[0];

interface CmsEvent {
  slug: string;
  title: string;
  year?: number | null;
  type?: string | null;
  summary?: string | null;
  location?: string | null;
  dateLabel?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  venue?: string | null;
  address?: string | null;
  sessions?: { label?: string | null; date?: string | null; time?: string | null }[] | null;
  heroImage?: Img;
  description?: Parameters<typeof blocksToParagraphs>[0];
  figures?: { caption?: string | null; credit?: string | null; image?: Img }[] | null;
  highlight?: { intro?: string | null; title?: string | null; lines?: string[] | null } | null;
  recapPhotos?: Img[] | null;
  artworks?:
    | {
        _id: string;
        title?: string | null;
        medium?: string | null;
        dimensions?: string | null;
        description?: string | null;
        image?: Img;
        artistName?: string | null;
        artistSlug?: string | null;
      }[]
    | null;
}

function fromCms(e: CmsEvent): Event {
  const cover = imageProps(e.heroImage, { width: 2400 });
  const figures = (e.figures ?? []).flatMap((f) => {
    const img = imageProps(f.image, { width: 960 });
    return img
      ? [{ ...img, fullSrc: imageProps(f.image, { width: 1800 })?.src, caption: f.caption ?? undefined, credit: f.credit ?? undefined }]
      : [];
  });
  const gallery = (e.recapPhotos ?? []).flatMap((p) => {
    const img = imageProps(p, { width: 600, height: 600 });
    return img ? [{ ...img, fullSrc: imageProps(p, { width: 1800 })?.src }] : [];
  });
  return {
    slug: e.slug,
    title: e.title,
    type: e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1) : "",
    year: e.year ?? undefined,
    location: e.location ?? undefined,
    startDate: e.startDate ?? undefined,
    endDate: e.endDate ?? undefined,
    dateLabel: e.dateLabel ?? undefined,
    venue: e.venue ?? undefined,
    address: e.address ?? undefined,
    summary: e.summary ?? undefined,
    description: blocksToParagraphs(e.description),
    schedule: (e.sessions ?? []).flatMap((s) =>
      s.label ? [{ label: s.label, value: [s.date, s.time].filter(Boolean).join(" · ") }] : [],
    ),
    artworks: (e.artworks ?? []).flatMap((a) => {
      const image = imageProps(a.image, { width: 700 });
      return image
        ? [
            {
              id: a._id,
              title: a.title ?? undefined,
              artist: a.artistName ?? undefined,
              artistSlug: a.artistSlug ?? undefined,
              medium: a.medium ?? undefined,
              dimensions: a.dimensions ?? undefined,
              description: a.description ?? undefined,
              image,
              fullSrc: imageProps(a.image, { width: 1800 })?.src,
            },
          ]
        : [];
    }),
    coverImage: cover ?? undefined,
    figures,
    gallery,
    highlight: e.highlight?.title
      ? { intro: e.highlight.intro ?? undefined, title: e.highlight.title, lines: e.highlight.lines ?? [] }
      : undefined,
  };
}

export async function getEvents(): Promise<Event[]> {
  const cms = await safeFetch<CmsEvent[] | null>(EVENTS_QUERY, {}, null);
  return (cms ?? []).map(fromCms);
}

export async function getEvent(slug: string): Promise<Event | null> {
  const cms = await safeFetch<CmsEvent | null>(EVENT_QUERY, { slug }, null);
  return cms ? fromCms(cms) : null;
}

export function eventDate(e: Event): string {
  return e.dateLabel ?? (e.year ? String(e.year) : "");
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
