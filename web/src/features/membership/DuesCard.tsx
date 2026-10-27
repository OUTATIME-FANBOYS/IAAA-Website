import { Button, SectionLabel } from "@/components/ui";
import { DUES_AMOUNT, DUES_PERKS, JOIN_URL } from "./data";

export function DuesCard() {
  return (
    <div className="mx-auto w-full max-w-[880px] overflow-hidden rounded-ds border border-subtle bg-white/60">
      <div className="flex flex-col gap-4 bg-burgundy p-8 text-white tablet:flex-row tablet:items-end tablet:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-label font-semibold uppercase">Annual membership</p>
          <h2 className="font-serif text-[1.75rem] font-semibold leading-tight">Artist membership</h2>
        </div>
        <p className="font-serif text-[3rem] font-semibold leading-none">
          {DUES_AMOUNT}
          <span className="ml-2 font-sans text-meta font-normal text-white/80">/ year</span>
        </p>
      </div>
      <div className="flex flex-col gap-6 p-8">
        <p className="text-body text-secondary">
          IAAA is an artist-run nonprofit. Your dues go toward lowering exhibition costs, reserving retreat
          spaces and hosting public art education.
        </p>
        <div className="flex flex-col gap-2">
          <SectionLabel>Good to know</SectionLabel>
          <ul className="flex flex-col gap-1 text-meta text-secondary">
            {DUES_PERKS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <Button href={JOIN_URL}>
            Become a member · {DUES_AMOUNT} / year
          </Button>
        </div>
      </div>
    </div>
  );
}
