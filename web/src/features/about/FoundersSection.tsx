import { EditorialCard, EditorialLink, Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";

export interface FoundersSectionProps {
  eyebrow?: string;
  heading: string;
  cardCaption?: string;
  link?: { label: string; href: string };
  founders: { name: string; slug: string }[];
  tone?: SectionTone;
}

export function FoundersSection({ eyebrow, heading, cardCaption, link, founders, tone }: FoundersSectionProps) {
  if (founders.length === 0) return null;
  return (
    <Section divider tone={tone} innerClassName="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
        <SectionHeading>{heading}</SectionHeading>
      </div>
      <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
        {founders.map((f) => (
          <li key={f.slug}>
            <EditorialCard href={`/members/${f.slug}`} title={f.name}>
              {cardCaption}
            </EditorialCard>
          </li>
        ))}
      </ul>
      {link ? (
        <div>
          <EditorialLink href={link.href}>{link.label}</EditorialLink>
        </div>
      ) : null}
    </Section>
  );
}
