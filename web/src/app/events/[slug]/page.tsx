import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, EditorialLink, Section, SectionHeading, SectionLabel } from "@/components/ui";
import { eventDate, getEvent, getEvents, googleCalendarUrl } from "@/features/events";

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
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const calendarUrl = googleCalendarUrl(event);
  const facts: { label: string; value: string }[] = [
    { label: "Date", value: eventDate(event) },
    ...(event.location ? [{ label: "Location", value: event.location }] : []),
    ...(event.venue ? [{ label: "Venue", value: event.venue }] : []),
    ...(event.address ? [{ label: "Address", value: event.address }] : []),
    ...(event.schedule ?? []),
  ];

  return (
    <Section>
      <div className="flex flex-col gap-6">
        <SectionLabel>{event.type}</SectionLabel>
        <SectionHeading as="h1">{event.title}</SectionHeading>
        <dl className="grid max-w-[720px] grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-meta">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="font-semibold text-primary">{f.label}</dt>
              <dd className="text-caption">{f.value}</dd>
            </div>
          ))}
        </dl>
        {event.description?.length ? (
          <div className="flex max-w-[720px] flex-col gap-4 text-body">
            {event.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-6">
          {calendarUrl ? (
            <Button href={calendarUrl} variant="primary">
              Add to calendar
            </Button>
          ) : null}
          <EditorialLink href="/events">All events</EditorialLink>
        </div>
      </div>
    </Section>
  );
}
