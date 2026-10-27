import type { Metadata } from "next";
import {
  EditorialCard,
  Section,
  SectionHeading,
  SectionLabel,
} from "@/components/ui";
import { MemberDirectory } from "@/features/members";
import { getMembers } from "@/features/members";

export const metadata: Metadata = {
  title: "Members | Indian American Artists Association",
  description:
    "Meet the Indian-origin visual artists who make up the Indian American Artists Association.",
};

export default async function MembersPage() {
  const members = await getMembers();
  const founders = members
    .filter((m) => m.isFounder)
    .sort(
      (a, b) =>
        (a.founderOrder ?? 9999) - (b.founderOrder ?? 9999) ||
        a.name.localeCompare(b.name),
    );
  return (
    <>
      <Section innerClassName="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <SectionLabel>Our community</SectionLabel>
          <SectionHeading as="h1">Member directory</SectionHeading>
          <p className="max-w-[720px] text-body text-secondary">
            Browse the artists of IAAA by leadership, advisory board, and
            member.
          </p>
        </div>
        <MemberDirectory members={members} />
      </Section>
      {founders.length > 0 && (
        <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
          <SectionLabel>Where it began</SectionLabel>
          <SectionHeading>Founding members</SectionHeading>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
            {founders.map((m) => (
              <li key={m.slug}>
                <EditorialCard href={`/members/${m.slug}`} title={m.name}>
                  {[m.role, m.medium, m.location].filter(Boolean).join(" · ")}
                </EditorialCard>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
