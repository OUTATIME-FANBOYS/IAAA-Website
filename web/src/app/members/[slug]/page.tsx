import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberProfile, getMemberBySlug, getMembers } from "@/features/members";
import { getSiteSettings } from "@/sanity/lib/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const members = await getMembers();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [member, settings] = await Promise.all([getMemberBySlug(slug), getSiteSettings()]);
  if (!member) return {};
  return {
    title: [member.name, settings.siteTitle].filter(Boolean).join(" | "),
    description: member.bio[0],
  };
}

export default async function MemberPage({ params }: Props) {
  const { slug } = await params;
  const [member, settings] = await Promise.all([getMemberBySlug(slug), getSiteSettings()]);
  if (!member) notFound();

  return <MemberProfile member={member} labels={settings.labels} />;
}
