import type { Metadata } from "next";
import {
  Button,
  EditorialCard,
  EditorialLink,
  InfoCardGrid,
  Section,
  SectionHeading,
  SectionLabel,
} from "@/components/ui";
import { MissionCharter, WHAT_WE_DO } from "@/features/about";
import { getFounders } from "@/features/members";

export const metadata: Metadata = {
  title: "About | Indian American Artists Association",
  description:
    "Empowering South Asian visual voices through exhibition access, grants and an enduring creative community.",
};

export default async function AboutPage() {
  const founders = await getFounders();
  return (
    <>
      <Section innerClassName="flex flex-col items-start gap-6">
        <SectionLabel>About IAAA</SectionLabel>
        <SectionHeading as="h1">Empowering South Asian visual voices.</SectionHeading>
        <p className="max-w-[720px] text-body text-secondary">
          IAAA is a 501(c)(3) nonprofit that supports Indian-origin visual artists in the United States through
          exhibition access, grants and an enduring creative community.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Button href="/membership">Become a member</Button>
          <EditorialLink href="/about/organization">How we are organized</EditorialLink>
        </div>
      </Section>

      <Section divider tone="blossom">
        <MissionCharter />
      </Section>

      <Section divider innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>What we do</SectionLabel>
          <SectionHeading>How we uplift South Asian visual arts</SectionHeading>
        </div>
        <InfoCardGrid items={WHAT_WE_DO} />
      </Section>

      {founders.length > 0 ? (
        <Section divider tone="pacific" innerClassName="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <SectionLabel>Founding members</SectionLabel>
            <SectionHeading>The artists who started IAAA</SectionHeading>
          </div>
          <ul className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
            {founders.map((f) => (
              <li key={f.slug}>
                <EditorialCard href={`/members/${f.slug}`} title={f.name}>
                  Read bio
                </EditorialCard>
              </li>
            ))}
          </ul>
          <div>
            <EditorialLink href="/members">Browse all artists</EditorialLink>
          </div>
        </Section>
      ) : null}
    </>
  );
}
