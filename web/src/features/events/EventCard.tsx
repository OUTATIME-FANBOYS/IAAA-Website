import { EditorialCard } from "@/components/ui";
import { eventDate, type Event } from "./data";

export function EventCard({ event }: { event: Event }) {
  const details = [event.type, eventDate(event), event.location].filter(Boolean).join(" · ");
  return (
    <EditorialCard href={`/events/${event.slug}`} title={event.title}>
      <span className="block">{details}</span>
      {event.summary ? <span className="mt-2 block">{event.summary}</span> : null}
    </EditorialCard>
  );
}
