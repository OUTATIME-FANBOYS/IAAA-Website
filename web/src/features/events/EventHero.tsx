import { FeatureHero } from "@/components/ui";
import { eventDate, type Event } from "./data";

export function EventHero({ event }: { event: Event }) {
  const meta = [eventDate(event), event.location].filter(Boolean).join(" · ");
  return (
    <FeatureHero label={event.type} title={event.title} image={event.coverImage}>
      {meta ? <p className="text-meta text-white/90">{meta}</p> : null}
      {event.summary ? <p className="text-meta text-white">{event.summary}</p> : null}
    </FeatureHero>
  );
}
