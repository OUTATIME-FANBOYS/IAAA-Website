import { Button, Section, SectionLabel, type SectionTone } from "@/components/ui";

export interface PricingSectionProps {
  label?: string;
  title: string;
  price: string;
  priceUnit?: string;
  body?: string;
  notesHeading?: string;
  notes?: string[];
  cta?: { label: string; href: string };
  tone?: SectionTone;
}

export function PricingSection({ label, title, price, priceUnit, body, notesHeading, notes = [], cta, tone }: PricingSectionProps) {
  return (
    <Section divider tone={tone}>
      <div className="mx-auto w-full max-w-[880px] overflow-hidden rounded-ds border border-subtle bg-white/60">
        <div className="flex flex-col gap-4 bg-burgundy p-8 text-white tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-2">
            {label ? <p className="text-label font-semibold uppercase">{label}</p> : null}
            <h2 className="font-serif text-[1.75rem] font-semibold leading-tight">{title}</h2>
          </div>
          <p className="font-serif text-[3rem] font-semibold leading-none">
            {price}
            {priceUnit ? <span className="ml-2 font-sans text-meta font-normal text-white/80">{priceUnit}</span> : null}
          </p>
        </div>
        <div className="flex flex-col gap-6 p-8">
          {body ? <p className="text-body text-secondary">{body}</p> : null}
          {notes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {notesHeading ? <SectionLabel>{notesHeading}</SectionLabel> : null}
              <ul className="flex flex-col gap-1 text-meta text-secondary">
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {cta ? (
            <div>
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
