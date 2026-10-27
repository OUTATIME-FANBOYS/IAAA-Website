import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfile } from "@/features/members";
import { getMemberBySlug, getMembers } from "@/features/members";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const members = await getMembers();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) return { title: "Member not found | Indian American Artists Association" };
  return {
    title: `${member.name} | Indian American Artists Association`,
    description: member.bio[0],
  };
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  return <MemberProfile member={member} />;
}
