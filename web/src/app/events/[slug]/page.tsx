import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventArtworks, EventBody, EventHero, RelatedEvents, getEvent, getEvents } from "@/features/events";
import { getSiteSettings } from "@/sanity/lib/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [event, settings] = await Promise.all([getEvent((await params).slug), getSiteSettings()]);
  if (!event) return {};
  return {
    title: [event.title, settings.siteTitle].filter(Boolean).join(" | "),
    description: event.summary ?? [event.title, event.location].filter(Boolean).join(" · "),
  };
}

export default async function EventPage({ params }: Props) {
  const slug = (await params).slug;
  const [event, all, settings] = await Promise.all([getEvent(slug), getEvents(), getSiteSettings()]);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />
      <EventBody event={event} labels={settings.labels} />
      <EventArtworks artworks={event.artworks ?? []} heading={settings.labels.eventArtworksHeading} />
      <RelatedEvents
        events={all.filter((e) => e.slug !== event.slug).slice(0, 3)}
        heading={settings.labels.eventRelatedHeading}
      />
    </>
  );
}
