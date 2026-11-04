import { Section, buttonClass, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";
import { getSignups, type Signups } from "./data";
import { LeadsForm, type LeadsFormLabels } from "./LeadsForm";

export interface WorkingGroup {
  name: string;
  title?: string;
  quote?: string;
  tasks: string[];
  fit?: string;
}

export interface WorkingGroupsSectionProps {
  eyebrow?: string;
  heading: string;
  intro?: string;
  anchorLabel?: string;
  stats: { label: string; value: string }[];
  tone?: SectionTone;
  wallEyebrow?: string;
  wallHeading?: string;
  wallIntro?: string;
  groups: WorkingGroup[];
  fitLabel?: string;
  emptyGroupText?: string;
  countOne?: string;
  countMany?: string;
  moreNames?: string;
  formHeading?: string;
  formIntro?: string;
  form: LeadsFormLabels;
  /** Sign-ups to show on the cards; fetched from the sheet when omitted. */
  signups?: Signups | null;
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));

/** Who has signed up for a group, as a line of text (or the "be the first" text). */
function signupLine(p: WorkingGroupsSectionProps, signups: Signups | null, group: string): string | undefined {
  if (!signups) return undefined;
  const count = signups.counts[group] ?? 0;
  if (count === 0) return p.emptyGroupText;
  const names = signups.names[group] ?? [];
  const shown = names.slice(0, 4).join(", ");
  const more = names.length > 4 && p.moreNames ? ` ${fill(p.moreNames, { count: names.length - 4 })}` : "";
  const template = count === 1 ? p.countOne : p.countMany;
  return template ? fill(template, { count, names: shown + more }) : undefined;
}

export async function WorkingGroupsSection(props: WorkingGroupsSectionProps) {
  const signups = props.signups === undefined ? await getSignups() : props.signups;
  const { groups } = props;
  return (
    <>
      <Section tone={props.tone} innerClassName="flex flex-col items-center gap-8 text-center">
        {props.eyebrow ? <SectionLabel>{props.eyebrow}</SectionLabel> : null}
        <SectionHeading className="max-w-[800px]">{props.heading}</SectionHeading>
        {props.intro ? <p className="max-w-[720px] text-body text-secondary">{props.intro}</p> : null}
        {props.anchorLabel ? (
          <a
            href="#sign-up"
            className={buttonClass()}
          >
            {props.anchorLabel} ↓
          </a>
        ) : null}
        {props.stats.length > 0 ? (
          <dl className="mt-4 grid w-full grid-cols-2 gap-6 border-y border-subtle py-6 tablet:grid-cols-4">
            {props.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="text-label font-semibold uppercase text-caption">{s.label}</dt>
                <dd className="font-serif text-card font-medium text-primary">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Section>

      <Section divider tone="blossom" innerClassName="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          {props.wallEyebrow ? <SectionLabel>{props.wallEyebrow}</SectionLabel> : null}
          {props.wallHeading ? <SectionHeading>{props.wallHeading}</SectionHeading> : null}
          {props.wallIntro ? <p className="max-w-[720px] text-body text-secondary">{props.wallIntro}</p> : null}
        </div>
        <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
          {groups.map((g) => {
            const line = signupLine(props, signups, g.name);
            return (
              <li key={g.name} className="flex flex-col gap-4 rounded-ds border border-subtle bg-paper p-6">
                <SectionLabel>{g.name}</SectionLabel>
                {g.title ? <h3 className="font-serif text-card font-medium text-primary">{g.title}</h3> : null}
                {g.quote ? <p className="text-meta italic text-secondary">“{g.quote}”</p> : null}
                {g.tasks.length > 0 ? (
                  <ul className="flex list-disc flex-col gap-1 pl-5 text-meta text-secondary">
                    {g.tasks.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                ) : null}
                {g.fit ? (
                  <p className="text-meta text-primary">
                    {props.fitLabel ? <span className="font-semibold">{props.fitLabel}: </span> : null}
                    {g.fit}
                  </p>
                ) : null}
                {line ? <p className="mt-auto border-t border-subtle pt-3 text-[0.8125rem] text-caption">{line}</p> : null}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section divider id="sign-up" innerClassName="flex max-w-[720px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          {props.formHeading ? <SectionHeading>{props.formHeading}</SectionHeading> : null}
          {props.formIntro ? <p className="text-body text-secondary">{props.formIntro}</p> : null}
        </div>
        <LeadsForm groups={groups.map((g) => g.name)} labels={props.form} />
      </Section>
    </>
  );
}
