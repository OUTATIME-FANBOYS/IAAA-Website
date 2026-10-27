import type { Metadata } from "next";
import { EditorialCard, EditorialLink, SectionHeading, SectionLabel, Section } from "@/components/ui";
import { ProgramGrid } from "@/components/org/ProgramGrid";
import { getOrgStructure } from "@/lib/org";

export const metadata: Metadata = {
  title: "Organization structure",
  description: "How the Indian American Artists Association is led and organized.",
};

export default async function OrganizationPage() {
  const org = await getOrgStructure();
  return (
    <>
      <Section innerClassName="flex flex-col gap-6">
        <SectionLabel>About IAAA</SectionLabel>
        <SectionHeading as="h1">Organization structure</SectionHeading>
        <p className="max-w-[720px] text-body text-secondary">{org.mission}</p>
      </Section>

      <Section divider innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>Leadership</SectionLabel>
          <SectionHeading>Board &amp; officers</SectionHeading>
        </div>
        <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-4">
          {org.leadership.map((r) => (
            <li key={r.title}>
              <EditorialCard href={r.person.href} title={r.person.name}>
                {r.title}
              </EditorialCard>
            </li>
          ))}
        </ul>
      </Section>

      <Section divider innerClassName="flex flex-col gap-6">
        <SectionLabel>Advisory board</SectionLabel>
        <SectionHeading>Guidance from our advisors</SectionHeading>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {org.advisoryBoard.map((p) => (
            <li key={p.name}>
              <EditorialLink href={p.href}>{p.name}</EditorialLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section divider>
        <SectionLabel>Standing programs</SectionLabel>
        <SectionHeading className="mt-4">Ongoing work</SectionHeading>
        <ProgramGrid programs={org.standingPrograms} />
      </Section>

      <Section divider>
        <SectionLabel>Flexible programs</SectionLabel>
        <SectionHeading className="mt-4">Pop-up initiatives</SectionHeading>
        <ProgramGrid programs={org.flexiblePrograms} />
      </Section>
    </>
  );
}
