import { ArtworkTile, LightboxGroup, Section, SectionHeading, type LightboxImage } from "@/components/ui";
import { lightboxLabels, type SiteLabels } from "@/sanity/lib/settings";
import type { EventArtwork } from "./data";

/** Grid of the artworks shown in an event; tiles open in the image overlay. */
export function EventArtworks({ artworks, heading, labels }: { artworks: EventArtwork[]; heading?: string; labels: SiteLabels }) {
  if (artworks.length === 0) return null;
  const images: LightboxImage[] = artworks.map((a) => ({
    src: a.fullSrc ?? a.image.src,
    alt: a.image.alt,
    title: a.title,
    details: [a.artist, a.medium, a.dimensions].filter(Boolean).join(" · ") || undefined,
    description: a.description,
    link: a.artist && a.artistSlug ? { label: a.artist, href: `/members/${a.artistSlug}` } : undefined,
  }));
  return (
    <Section divider innerClassName="flex flex-col gap-8">
      {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      <LightboxGroup images={images} labels={lightboxLabels(labels) ?? { close: "", previous: "", next: "", dialog: "" }}>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 tablet:grid-cols-3 desktop:grid-cols-4">
          {artworks.map((a, i) => (
            <li key={a.id}>
              <ArtworkTile
                image={a.image}
                title={a.title}
                lightboxIndex={i}
                subtitle={[a.artist, a.medium].filter(Boolean).join(" · ") || undefined}
              />
            </li>
          ))}
        </ul>
      </LightboxGroup>
    </Section>
  );
}
