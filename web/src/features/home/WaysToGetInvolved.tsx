import { Button, EditorialLink, Section, SectionHeading, type SectionTone } from "@/components/ui";

export interface WayCard {
  title: string;
  body?: string;
  button?: { label: string; href: string; style?: "primary" | "secondary" };
}

export interface WaysToGetInvolvedProps {
  heading: string;
  cards: WayCard[];
  footerLink?: { label: string; href: string };
  tone?: SectionTone;
}

export function WaysToGetInvolved({ heading, cards, footerLink, tone }: WaysToGetInvolvedProps) {
  return (
    <Section divider tone={tone} innerClassName="flex flex-col items-center gap-10">
      <SectionHeading className="text-center">{heading}</SectionHeading>
      <ul className="grid w-full grid-cols-1 gap-6 tablet:grid-cols-3">
        {cards.map((w) => (
          <li
            key={w.title}
            className="flex flex-col items-center gap-4 rounded-ds border border-subtle bg-paper p-8 text-center"
          >
            <h3 className="font-serif text-card font-medium text-primary">{w.title}</h3>
            {w.body ? <p className="flex-1 text-meta text-secondary">{w.body}</p> : null}
            {w.button ? (
              <Button href={w.button.href} variant={w.button.style === "primary" ? "primary" : "secondary"}>
                {w.button.label}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
      {footerLink ? <EditorialLink href={footerLink.href}>{footerLink.label}</EditorialLink> : null}
    </Section>
  );
}
