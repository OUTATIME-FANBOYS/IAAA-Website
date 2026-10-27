import type { Metadata } from "next";
import { Button, EditorialLink, InfoCardGrid, Section, SectionHeading, SectionLabel } from "@/components/ui";
import { BENEFITS, DUES_AMOUNT, DuesCard, EligibilityList, JOIN_URL } from "@/features/membership";

export const metadata: Metadata = {
  title: "Membership | Indian American Artists Association",
  description:
    "Join a growing network of Indian-origin visual artists creating, exhibiting and building community across the United States.",
};

export default function MembershipPage() {
  return (
    <>
      <Section innerClassName="flex flex-col items-start gap-6">
        <SectionLabel>Membership</SectionLabel>
        <SectionHeading as="h1">Join our community of Indian American artists.</SectionHeading>
        <p className="max-w-[720px] text-body text-secondary">
          Your art has a story. Find the community that helps it travel further. Join a growing network of
          Indian-origin visual artists creating, exhibiting and building community across the United States.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Button href={JOIN_URL}>Become a member · {DUES_AMOUNT} / year</Button>
          <EditorialLink href="/about/organization">How IAAA is organized</EditorialLink>
        </div>
      </Section>

      <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>What you get</SectionLabel>
          <SectionHeading>Benefits of membership</SectionHeading>
        </div>
        <InfoCardGrid items={BENEFITS} columns={3} />
      </Section>

      <Section divider innerClassName="grid grid-cols-1 gap-10 tablet:grid-cols-12 tablet:gap-12">
        <div className="flex flex-col items-start gap-4 tablet:col-span-5">
          <SectionLabel>Who can join</SectionLabel>
          <SectionHeading>An open, welcoming guild</SectionHeading>
          <p className="text-body text-secondary">
            Whether you work in oil, clay, fiber or pixels, there is a place for your practice here.
          </p>
        </div>
        <div className="tablet:col-span-7">
          <EligibilityList />
        </div>
      </Section>

      <Section divider tone="pacific">
        <DuesCard />
      </Section>
    </>
  );
}
