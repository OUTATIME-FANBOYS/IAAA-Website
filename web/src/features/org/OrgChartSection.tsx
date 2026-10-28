import { InfoCardGrid, Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";
import type { OrgStructure } from "./data";
import { ProgramModel, type ProgramModelCopy } from "./ProgramModel";

export interface OrgChartSectionProps {
  org: OrgStructure;
  copy: ProgramModelCopy & { popupEyebrow?: string; popupHeading?: string };
  tone?: SectionTone;
  popupTone?: SectionTone;
}

/** The program model chart, followed by the flexible (pop-up) programs. */
export function OrgChartSection({ org, copy, tone, popupTone }: OrgChartSectionProps) {
  return (
    <>
      <Section divider tone={tone}>
        <ProgramModel org={org} copy={copy} />
      </Section>
      {org.flexiblePrograms.length > 0 ? (
        <Section divider tone={popupTone} innerClassName="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {copy.popupEyebrow ? <SectionLabel>{copy.popupEyebrow}</SectionLabel> : null}
            {copy.popupHeading ? <SectionHeading>{copy.popupHeading}</SectionHeading> : null}
          </div>
          <InfoCardGrid items={org.flexiblePrograms.map((p) => ({ title: p.title, description: p.description }))} />
        </Section>
      ) : null}
    </>
  );
}
