import Image from "next/image";
import { Button, EditorialLink, LightboxGroup, LightboxTrigger, Section, type LightboxImage } from "@/components/ui";
import { EventFigure } from "./EventFigure";
import { lightboxLabels, type SiteLabels } from "@/sanity/lib/settings";
import { eventDate, googleCalendarUrl, type Event } from "./data";

/** Two-column editorial body: captioned figures on the left, article on the right. */
export function EventBody({ event, labels }: { event: Event; labels: SiteLabels }) {
  const calendarUrl = googleCalendarUrl(event);
  const facts: { label: string; value: string }[] = [
    ...(labels.eventDate && eventDate(event) ? [{ label: labels.eventDate, value: eventDate(event) }] : []),
    ...(event.venue && labels.eventVenue ? [{ label: labels.eventVenue, value: event.venue }] : []),
    ...(event.address && labels.eventAddress ? [{ label: labels.eventAddress, value: event.address }] : []),
    ...(event.location && labels.eventLocation ? [{ label: labels.eventLocation, value: event.location }] : []),
    ...(event.schedule ?? []),
  ];
  const figures = event.figures ?? [];
  const gallery = event.gallery ?? [];
  const viewerLabels = lightboxLabels(labels) ?? { close: "", previous: "", next: "", dialog: "" };
  const toViewer = (i: { src: string; fullSrc?: string; alt: string; caption?: string; credit?: string }): LightboxImage => ({
    src: i.fullSrc ?? i.src,
    alt: i.alt,
    title: i.caption,
    details: i.credit,
  });

  return (
    <Section innerClassName="grid grid-cols-1 gap-10 tablet:grid-cols-12 tablet:gap-12">
      {figures.length > 0 ? (
        <div className="flex flex-col gap-10 tablet:col-span-5 tablet:pr-6">
          <LightboxGroup images={figures.map(toViewer)} labels={viewerLabels}>
            {figures.map((f, i) => (
              <EventFigure key={f.src} image={f} lightboxIndex={i} />
            ))}
          </LightboxGroup>
        </div>
      ) : null}
      <div
        className={`flex flex-col gap-6 ${figures.length > 0 ? "tablet:col-span-7" : "tablet:col-span-8 tablet:col-start-3"}`}
      >
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-subtle pb-6 text-meta empty:hidden">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="font-semibold text-primary">{f.label}</dt>
              <dd className="text-secondary">{f.value}</dd>
            </div>
          ))}
        </dl>
        {event.description?.map((p, i) => (
          <p key={i} className="text-body text-secondary">
            {p}
          </p>
        ))}
        {event.highlight ? (
          <blockquote className="flex flex-col gap-3 border-l-2 border-burgundy pl-6">
            {event.highlight.intro ? <p className="text-meta text-caption">{event.highlight.intro}</p> : null}
            <p className="font-serif text-card font-semibold text-burgundy">{event.highlight.title}</p>
            <p className="text-body text-secondary">
              {event.highlight.lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </p>
          </blockquote>
        ) : null}
        {gallery.length > 0 ? (
          <LightboxGroup images={gallery.map(toViewer)} labels={viewerLabels}>
            <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
              {gallery.map((g, i) => (
                <li key={g.src}>
                  <LightboxTrigger index={i} label={g.alt}>
                    <span className="relative block aspect-square overflow-hidden rounded-ds">
                      <Image src={g.src} alt={g.alt} fill sizes="(min-width: 810px) 15vw, 50vw" className="object-cover" />
                    </span>
                  </LightboxTrigger>
                </li>
              ))}
            </ul>
          </LightboxGroup>
        ) : null}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          {calendarUrl && labels.eventAddToCalendar ? (
            <Button href={calendarUrl} variant="primary">
              {labels.eventAddToCalendar}
            </Button>
          ) : null}
          {labels.eventAllEvents ? <EditorialLink href="/events">{labels.eventAllEvents}</EditorialLink> : null}
        </div>
      </div>
    </Section>
  );
}
