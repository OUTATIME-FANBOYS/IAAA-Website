import { SectionLabel } from "@/components/ui";
import { ELIGIBILITY_STATEMENT, MISSION_STATEMENT } from "./data";

function Charter({ label, text }: { label: string; text: string }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-ds border border-subtle bg-white/60 p-8">
      <SectionLabel>{label}</SectionLabel>
      <blockquote className="border-l-2 border-burgundy pl-5 text-body text-primary">“{text}”</blockquote>
    </figure>
  );
}

/** The two founding statements, side by side. */
export function MissionCharter() {
  return (
    <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
      <Charter label="Our mission" text={MISSION_STATEMENT} />
      <Charter label="Who can join" text={ELIGIBILITY_STATEMENT} />
    </div>
  );
}
