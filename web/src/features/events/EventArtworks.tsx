import Image from "next/image";
import { EditorialLink, Section, SectionHeading } from "@/components/ui";
import type { EventArtwork } from "./data";

/** Grid of the artworks shown in an event. */
export function EventArtworks({ artworks, heading }: { artworks: EventArtwork[]; heading?: string }) {
  if (artworks.length === 0) return null;
  return (
    <Section divider innerClassName="flex flex-col gap-8">
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-10 tablet:grid-cols-3 desktop:grid-cols-4">
        {artworks.map((a) => (
          <li key={a.id} className="flex flex-col gap-2">
            <Image
              src={a.image.src}
              alt={a.image.alt}
              width={700}
              height={700}
              sizes="(min-width: 1200px) 25vw, (min-width: 810px) 33vw, 50vw"
              className="h-auto w-full rounded-ds border border-subtle"
            />
            {a.title ? <span className="font-serif text-meta font-medium text-primary">{a.title}</span> : null}
            {a.artist ? (
              <span className="text-[0.8125rem] text-caption">
                {a.artistSlug ? <EditorialLink href={`/members/${a.artistSlug}`}>{a.artist}</EditorialLink> : a.artist}
              </span>
            ) : null}
            {[a.medium, a.dimensions].filter(Boolean).length ? (
              <span className="text-[0.8125rem] text-caption">{[a.medium, a.dimensions].filter(Boolean).join(" · ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
