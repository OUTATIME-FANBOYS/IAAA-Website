import { Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";

export interface ChecklistItem {
  title: string;
  description?: string;
}

export interface ChecklistSectionProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: ChecklistItem[];
  tone?: SectionTone;
}

/** Heading and intro on the left, a divided list of titled items on the right. */
export function ChecklistSection({ eyebrow, heading, intro, items, tone }: ChecklistSectionProps) {
  return (
    <Section divider tone={tone} innerClassName="grid grid-cols-1 gap-10 tablet:grid-cols-12 tablet:gap-12">
      <div className="flex flex-col items-start gap-4 tablet:col-span-5">
        {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
        <SectionHeading>{heading}</SectionHeading>
        {intro ? <p className="text-body text-secondary">{intro}</p> : null}
      </div>
      <ul className="flex flex-col divide-y divide-subtle border-y border-subtle tablet:col-span-7">
        {items.map((e) => (
          <li key={e.title} className="flex flex-col gap-1 py-5">
            <h3 className="font-serif text-card font-medium text-primary">{e.title}</h3>
            {e.description ? <p className="text-meta text-secondary">{e.description}</p> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
