import { Section, SectionHeading } from "@/components/ui";
import { EventCard } from "./EventCard";
import type { Event } from "./data";

export function RelatedEvents({ events, heading }: { events: Event[]; heading?: string }) {
  if (events.length === 0) return null;
  return (
    <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
      {heading ? <SectionHeading className="text-burgundy">{heading}</SectionHeading> : null}
      <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
        {events.map((e) => (
          <li key={e.slug}>
            <EventCard event={e} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
