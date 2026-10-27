import type { Metadata } from "next";
import { Section, SectionHeading, SectionLabel } from "@/components/ui";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Events | Indian American Artists Association",
  description:
    "Artist retreats and gatherings of the Indian American Artists Association.",
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <Section>
        <div className="flex flex-col gap-6">
          <SectionLabel>Creating connections</SectionLabel>
          <SectionHeading as="h1">Events</SectionHeading>
          <p className="max-w-[720px] text-body">
            Our artist retreats foster stronger bonds within the organization and create
            meaningful impact in the communities our members call home.
          </p>
        </div>
      </Section>
      <Section divider>
        {events.length === 0 ? (
          <p className="text-body">No events are listed right now. Please check back soon.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
            {events.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
