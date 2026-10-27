import { SectionLabel, SmartLink } from "@/components/ui";
import type { OrgPerson, OrgStructure } from "./data";

const PROGRAM_TONES = [
  { border: "border-burgundy/40", badge: "bg-burgundy/10 text-burgundy" },
  { border: "border-pacific/60", badge: "bg-pacific/25 text-primary" },
  { border: "border-primary/30", badge: "bg-primary/10 text-primary" },
  { border: "border-blossom", badge: "bg-blossom/40 text-burgundy" },
];

function PersonChip({ person }: { person: OrgPerson }) {
  return (
    <SmartLink
      href={person.href}
      className="rounded-full border border-subtle bg-paper px-3 py-1 text-[0.8125rem] font-medium text-primary transition-colors duration-400 hover:border-burgundy hover:text-burgundy"
    >
      {person.name}
    </SmartLink>
  );
}

function Heading({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-label font-semibold uppercase text-primary">{label}</h3>
      <p className="text-meta text-caption">{note}</p>
    </div>
  );
}

/** The org chart: officers around a core mission, advisory board, and standing programs. */
export function ProgramModel({ org }: { org: OrgStructure }) {
  return (
    <div className="flex flex-col gap-12 rounded-ds border border-subtle bg-white/40 p-6 tablet:p-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <SectionLabel>Organizational ecosystem</SectionLabel>
        <h2 className="font-serif text-heading font-medium text-primary max-tablet:text-[1.875rem]">Program model</h2>
        <p className="text-meta text-secondary">By artists. For artists. With community.</p>
      </div>

      <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
        {org.leadership.map((r) => (
          <li
            key={r.title}
            className="flex flex-col items-center gap-2 rounded-ds border border-subtle bg-white p-5 text-center"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blossom/40 font-serif text-card font-semibold text-burgundy"
            >
              {r.title[0]}
            </span>
            <h3 className="text-label font-semibold uppercase text-primary">{r.title}</h3>
            <p className="text-meta text-secondary">{r.focus}</p>
            <div className="mt-auto pt-2">
              <PersonChip person={r.person} />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center">
        <div className="relative flex w-full max-w-[420px] flex-col items-center gap-6 rounded-ds border border-dashed border-primary/30 px-6 pb-10 pt-8">
          <p className="absolute -top-3 bg-paper px-3 text-center text-[0.6875rem] font-semibold uppercase tracking-wider text-caption">
            <span className="block text-primary">The core</span>
            Minimum viable board · legal &amp; fiscal guardians
          </p>
          <div className="flex w-full max-w-[260px] flex-col items-center gap-3 rounded-ds bg-primary p-8 text-center text-paper">
            <span className="text-label font-semibold uppercase text-blossom">Our mission</span>
            <p className="text-body font-medium leading-snug">{org.mission}</p>
            <span aria-hidden="true" className="h-0.5 w-8 bg-blossom" />
          </div>
        </div>
        <span aria-hidden="true" className="h-8 w-px bg-primary/30" />
      </div>

      <div className="flex flex-col items-center gap-5">
        <Heading label="Advisory board" note="Non-voting & community counsel" />
        <ul className="flex flex-wrap justify-center gap-3">
          {org.advisoryBoard.map((p) => (
            <li key={p.name}>
              <PersonChip person={p} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-6 border-t border-subtle pt-12">
        <Heading label="Standing programs" note="Essential for long-term viability" />
        <ul className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
          {org.standingPrograms.map((p, i) => {
            const tone = PROGRAM_TONES[i % PROGRAM_TONES.length];
            return (
              <li
                key={p.title}
                className={`flex flex-col items-center gap-3 rounded-ds border-2 bg-white p-6 text-center ${tone.border}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 items-center justify-center rounded-full font-serif text-card font-semibold ${tone.badge}`}
                >
                  {i + 1}
                </span>
                <h4 className="text-label font-semibold uppercase text-burgundy">{p.title}</h4>
                {p.description ? <p className="text-meta text-secondary">{p.description}</p> : null}
                {p.example ? (
                  <p className="mt-auto w-full border-t border-subtle pt-3 text-[0.8125rem] text-caption">{p.example}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
