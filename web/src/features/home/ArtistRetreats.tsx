import { EditorialLink, Section, SectionHeading, SectionLabel } from "@/components/ui";

const DEFAULT_LINKS = [
  { label: "2026 Artist’s Retreat · Sausalito, CA", href: "https://www.indianamericanartists.org/events/2026-artist-retreat" },
  { label: "2025 Artist’s Retreat · Florence, AL", href: "https://www.indianamericanartists.org/events/2025-artist-retreat" },
];

export interface ArtistRetreatsProps {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  links?: { label: string | null; href: string | null }[] | null;
}

export function ArtistRetreats({ eyebrow, heading, body, links }: ArtistRetreatsProps = {}) {
  const list = links && links.length > 0 ? links : DEFAULT_LINKS;
  return (
    <Section divider innerClassName="flex flex-col items-start gap-6">
      <SectionLabel>{eyebrow || "Creating connections"}</SectionLabel>
      <SectionHeading>{heading || "More than art. A sense of belonging."}</SectionHeading>
      <p className="max-w-[720px] text-body text-secondary">
        {body ||
          "Our artist retreats foster stronger bonds within the organization and create meaningful impact in the communities our members call home."}
      </p>
      <div className="flex flex-col items-start gap-3">
        {list.map((l, i) => (
          <EditorialLink key={i} href={l.href || "#"}>
            {l.label}
          </EditorialLink>
        ))}
      </div>
    </Section>
  );
}
