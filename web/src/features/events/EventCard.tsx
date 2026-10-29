import { EditorialCard } from "@/components/ui";
import { eventDate, type Event } from "./data";

export function EventCard({ event }: { event: Event }) {
  const details = [event.type, eventDate(event), event.location].filter(Boolean).join(" · ");
  return (
    <EditorialCard href={`/events/${event.slug}`} title={event.title}>
      <span className="line-clamp-1">{details}</span>
      {event.summary ? <span className="mt-1 line-clamp-2">{event.summary}</span> : null}
    </EditorialCard>
  );
}
