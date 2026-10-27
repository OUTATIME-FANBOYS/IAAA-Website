import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventBody, EventHero, RelatedEvents, getEvent, getEvents } from "@/features/events";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  if (!event) return {};
  return {
    title: `${event.title} | Indian American Artists Association`,
    description: event.summary ?? [event.title, event.location].filter(Boolean).join(" · "),
  };
}

export default async function EventPage({ params }: Props) {
  const slug = (await params).slug;
  const [event, all] = await Promise.all([getEvent(slug), getEvents()]);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />
      <EventBody event={event} />
      <RelatedEvents events={all.filter((e) => e.slug !== event.slug).slice(0, 3)} />
    </>
  );
}
