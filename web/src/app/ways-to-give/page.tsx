import type { Metadata } from "next";
import { Section, SectionHeading, SectionLabel } from "@/components/ui";
import { GivingChannels, TRUST_POINTS } from "@/features/giving";

export const metadata: Metadata = {
  title: "Ways to give | Indian American Artists Association",
  description:
    "Support South Asian artists and culture with a tax-deductible gift to the Indian American Artists Association.",
};

export default function WaysToGivePage() {
  return (
    <>
      <Section innerClassName="flex flex-col items-center gap-6 text-center">
        <SectionLabel>Support South Asian artists &amp; culture</SectionLabel>
        <SectionHeading as="h1">Ways to give</SectionHeading>
        <p className="max-w-[720px] text-body text-secondary">
          Every gift nurtures an artist’s voice, funds regional exhibitions and keeps our creative heritage
          thriving across North America. IAAA is a recognized 501(c)(3) organization.
        </p>
        <ul className="flex flex-wrap justify-center gap-3">
          {TRUST_POINTS.map((p) => (
            <li
              key={p}
              className="rounded-full border border-subtle bg-white/60 px-4 py-1.5 text-[0.8125rem] font-medium text-primary"
            >
              {p}
            </li>
          ))}
        </ul>
      </Section>

      <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>Giving channels</SectionLabel>
          <SectionHeading>Choose how you would like to contribute</SectionHeading>
        </div>
        <GivingChannels />
      </Section>
    </>
  );
}
