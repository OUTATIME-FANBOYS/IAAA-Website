import { Section, SectionLabel, type SectionTone } from "@/components/ui";

export interface Quote {
  label: string;
  text: string;
}

function Charter({ label, text }: Quote) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-ds border border-subtle bg-white/60 p-8">
      <SectionLabel>{label}</SectionLabel>
      <blockquote className="border-l-2 border-burgundy pl-5 text-body text-primary">“{text}”</blockquote>
    </figure>
  );
}

/** Labelled statements, side by side (e.g. mission and eligibility). */
export function QuotesSection({ quotes, tone }: { quotes: Quote[]; tone?: SectionTone }) {
  if (quotes.length === 0) return null;
  return (
    <Section divider tone={tone}>
      <div className={`grid grid-cols-1 gap-6 ${quotes.length > 1 ? "tablet:grid-cols-2" : ""}`}>
        {quotes.map((q) => (
          <Charter key={q.label} {...q} />
        ))}
      </div>
    </Section>
  );
}
