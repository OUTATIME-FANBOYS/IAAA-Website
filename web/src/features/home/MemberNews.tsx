import { EditorialCard, Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";

export interface NewsEntry {
  title: string;
  href: string;
}

export interface MemberNewsProps {
  eyebrow?: string;
  heading?: string;
  items: NewsEntry[];
  tone?: SectionTone;
}

export function MemberNews({ eyebrow, heading, items, tone }: MemberNewsProps) {
  if (items.length === 0) return null;
  return (
    <Section divider tone={tone} innerClassName="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
        {heading ? <SectionHeading>{heading}</SectionHeading> : null}
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
        {items.map((item, i) => (
          <li key={i}>
            <EditorialCard href={item.href} title={item.title} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
