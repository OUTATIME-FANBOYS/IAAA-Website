import type { Metadata } from "next";
import { InfoCardGrid, Section, SectionHeading, SectionLabel } from "@/components/ui";
import { ProgramModel, getOrgStructure } from "@/features/org";

export const metadata: Metadata = {
  title: "Organization structure | Indian American Artists Association",
  description: "How the Indian American Artists Association is led and organized.",
};

export default async function OrganizationPage() {
  const org = await getOrgStructure();
  return (
    <>
      <Section innerClassName="flex flex-col gap-6">
        <SectionLabel>About IAAA</SectionLabel>
        <SectionHeading as="h1">By artists. For artists. With community.</SectionHeading>
        <p className="max-w-[720px] text-body text-secondary">
          IAAA is run by a small board of working artists, guided by an advisory board, and carried
          out through standing and pop-up programs. Our mission: {org.mission}
        </p>
      </Section>

      <Section divider tone="pacific">
        <ProgramModel org={org} />
      </Section>

      <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>Flexible programs</SectionLabel>
          <SectionHeading>Pop-up initiatives</SectionHeading>
        </div>
        <InfoCardGrid items={org.flexiblePrograms} />
      </Section>
    </>
  );
}
