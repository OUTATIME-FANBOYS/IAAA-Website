/** Member data access. All member content comes from Sanity. */
import { safeFetch } from "@/sanity/lib/fetch";
import { blocksToParagraphs } from "@/sanity/lib/text";
import { imageProps } from "@/sanity/lib/image";
import type { SiteLabels } from "@/sanity/lib/settings";
import { FOUNDERS_QUERY, MEMBERS_QUERY, MEMBER_QUERY } from "@/sanity/lib/queries";

export type MemberGroup = "leadership" | "advisory" | "member";

const GROUP_LABEL_KEYS: Record<MemberGroup, string> = {
  leadership: "memberGroupLeadership",
  advisory: "memberGroupAdvisory",
  member: "memberGroupMember",
};

/** Display names for the member groups, from the Interface labels in Site settings. */
export function groupLabels(labels: SiteLabels): Record<MemberGroup, string> {
  return {
    leadership: labels[GROUP_LABEL_KEYS.leadership] ?? "",
    advisory: labels[GROUP_LABEL_KEYS.advisory] ?? "",
    member: labels[GROUP_LABEL_KEYS.member] ?? "",
  };
}

export interface MemberSocialLink {
  label: string;
  href: string;
}

export interface MemberArtwork {
  title?: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
  image?: { src: string; alt: string };
}

export interface MemberEvent {
  title: string;
  /** Internal path or absolute URL */
  href: string;
}

export interface Member {
  slug: string;
  name: string;
  group: MemberGroup;
  /** Listed under founding members in the header menu and founders sections */
  isFounder?: boolean;
  founderOrder?: number;
  /** Role, e.g. "President" */
  role?: string;
  location?: string;
  medium?: string;
  /** Paragraphs of plain text */
  bio: string[];
  /** Portrait URL; absent means a neutral placeholder is shown */
  portraitUrl?: string;
  /** Optional video about the artist (e.g. YouTube). */
  videoUrl?: string;
  social: MemberSocialLink[];
  featuredWork: MemberArtwork[];
  events: MemberEvent[];
}

export interface FounderLink {
  name: string;
  slug: string;
}

interface CmsMember {
  name: string;
  slug: string;
  roleTitle?: string | null;
  group?: MemberGroup | null;
  isFounder?: boolean | null;
  founderOrder?: number | null;
  location?: string | null;
  tagline?: string | null;
  photo?: { asset?: unknown; alt?: string | null } | null;
  bio?: Parameters<typeof blocksToParagraphs>[0];
  links?: Partial<Record<"website" | "instagram" | "facebook" | "youtube" | "blog", string | null>> | null;
  videoUrl?: string | null;
  featuredArtworks?:
    | {
        title?: string | null;
        year?: string | number | null;
        medium?: string | null;
        dimensions?: string | null;
        description?: string | null;
        image?: { asset?: unknown; alt?: string | null } | null;
      }[]
    | null;
  events?: { title?: string | null; slug?: string | null }[] | null;
}

const LINK_LABELS: [keyof NonNullable<CmsMember["links"]>, string][] = [
  ["website", "Website"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
  ["blog", "Blog"],
];

function fromCms(m: CmsMember): Member {
  const portrait = imageProps(m.photo, { width: 960 });
  return {
    slug: m.slug,
    name: m.name,
    group: m.group ?? "member",
    isFounder: m.isFounder ?? false,
    founderOrder: m.founderOrder ?? undefined,
    role: m.roleTitle ?? undefined,
    location: m.location ?? undefined,
    medium: m.tagline ?? undefined,
    bio: blocksToParagraphs(m.bio),
    portraitUrl: portrait?.src,
    social: LINK_LABELS.flatMap(([key, label]) => {
      const href = m.links?.[key];
      return href ? [{ label, href }] : [];
    }),
    videoUrl: m.videoUrl ?? undefined,
    featuredWork: (m.featuredArtworks ?? []).flatMap((a) => {
      const image = imageProps(a.image, { width: 800 });
      if (!a.title && !image) return [];
      return [
        {
          title: a.title ?? undefined,
          year: a.year != null ? String(a.year) : undefined,
          medium: a.medium ?? undefined,
          dimensions: a.dimensions ?? undefined,
          description: a.description ?? undefined,
          image: image ?? undefined,
        },
      ];
    }),
    events: (m.events ?? []).flatMap((e) => (e.title && e.slug ? [{ title: e.title, href: `/events/${e.slug}` }] : [])),
  };
}

export async function getMembers(): Promise<Member[]> {
  const cms = await safeFetch<CmsMember[] | null>(MEMBERS_QUERY, {}, null);
  return (cms ?? []).map(fromCms);
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  const cms = await safeFetch<CmsMember | null>(MEMBER_QUERY, { slug }, null);
  return cms ? fromCms(cms) : null;
}

/** Founding members (name + slug), ordered. */
export async function getFounders(): Promise<FounderLink[]> {
  return safeFetch<FounderLink[]>(FOUNDERS_QUERY, {}, []);
}
