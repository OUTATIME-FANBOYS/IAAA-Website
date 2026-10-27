/**
 * Member data access. Reads from Sanity; falls back to the local sample data
 * below when the CMS is unconfigured, unreachable, or has no members yet.
 */
import { safeFetch } from "@/sanity/lib/fetch";
import { imageProps } from "@/sanity/lib/image";
import { FOUNDERS_QUERY, MEMBERS_QUERY, MEMBER_QUERY } from "@/sanity/lib/queries";

export type MemberGroup = "leadership" | "advisory" | "member";

export const MEMBER_GROUP_LABELS: Record<MemberGroup, string> = {
  leadership: "Leadership",
  advisory: "Advisory board",
  member: "Members",
};

export interface MemberSocialLink {
  label: string;
  href: string;
}

export interface MemberArtwork {
  title: string;
  year?: string;
  medium?: string;
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
  /** Listed under "Founding members" in the header menu and on the Members page */
  isFounder?: boolean;
  founderOrder?: number;
  /** Role, e.g. "President" (leadership/advisory only) */
  role?: string;
  location?: string;
  medium?: string;
  /** Paragraphs of plain text */
  bio: string[];
  /** Portrait URL; absent means a neutral placeholder is shown */
  portraitUrl?: string;
  social: MemberSocialLink[];
  featuredWork: MemberArtwork[];
  events: MemberEvent[];
}

const PLACEHOLDER_BIO = [
  "Placeholder biography. This is sample text standing in for a real member statement until content is loaded from the CMS.",
  "It describes a fictional artist and should not be published.",
];

const MEMBERS: Member[] = [
  {
    slug: "sujata-tibrewala",
    name: "Sujata Tibrewala",
    group: "leadership",
    isFounder: true,
    founderOrder: 1,
    role: "Founder & President",
    medium: "Visual art",
    bio: [
      "Sujata Tibrewala is an award-winning, self-taught ecofeminist visual artist and educator affiliated with Lalit Kala Academy India. She is the founder and president of the Indian American Artists Association (IAAA), a nonprofit organization dedicated to providing exhibition platforms for Indian-origin artists throughout the United States.",
      "She teaches a summer course at Santa Clara University, “Indian Art and Its Influences On The World,” which looks at how ancient and colonial Indian art has shaped global design and fashion.",
      "In 2025 she presents her Feminist and Curvy Yoga series with the City of Milpitas (March–May) and Mandala Reinvented at ARTogether in Oakland (April). She has led popular workshops, including “Mandala Reinvented for Mental Wellbeing,” at the Triton Museum, the Sunnyvale Art Club, and IAAA’s 2025 Art Retreat.",
      "Sujata is an active docent at the San Jose Museum of Art, and her work has been exhibited internationally at the University of Illinois Chicago, Lalit Kala Academy in New Delhi, and Jawahar Kala Kendra in Jaipur.",
    ],
    social: [
      { label: "Website", href: "https://sujatapratibimba.com" },
      { label: "Instagram", href: "https://www.instagram.com/sujata.tibre" },
    ],
    featuredWork: [],
    events: [
      { title: "2025 Artist’s Retreat · Florence, AL", href: "https://www.indianamericanartists.org/events/2025-artist-retreat" },
    ],
  },
  {
    slug: "sample-artist-one",
    name: "Sample Artist One (placeholder)",
    group: "leadership",
    role: "President (placeholder)",
    location: "Placeholder City, CA",
    medium: "Oil on canvas",
    bio: PLACEHOLDER_BIO,
    social: [{ label: "Website", href: "https://example.com" }],
    featuredWork: [
      { title: "Untitled Study No. 1", year: "2024", medium: "Oil on canvas" },
      { title: "Untitled Study No. 2", year: "2025", medium: "Oil on canvas" },
    ],
    events: [{ title: "Sample Retreat 2026 (placeholder)", href: "/events" }],
  },
  {
    slug: "sample-artist-two",
    name: "Sample Artist Two (placeholder)",
    group: "advisory",
    role: "Advisor (placeholder)",
    location: "Placeholder Town, NY",
    medium: "Watercolor",
    bio: PLACEHOLDER_BIO,
    social: [{ label: "Instagram", href: "https://example.com/instagram" }],
    featuredWork: [{ title: "Untitled Study No. 3", year: "2023", medium: "Watercolor" }],
    events: [],
  },
  {
    slug: "sample-artist-three",
    name: "Sample Artist Three (placeholder)",
    group: "member",
    location: "Placeholder Falls, TX",
    medium: "Sculpture",
    bio: PLACEHOLDER_BIO,
    social: [],
    featuredWork: [],
    events: [{ title: "Sample Group Show (placeholder)", href: "/events" }],
  },
  {
    slug: "sample-artist-four",
    name: "Sample Artist Four (placeholder)",
    group: "member",
    location: "Placeholder Bay, WA",
    medium: "Printmaking",
    bio: PLACEHOLDER_BIO,
    social: [],
    featuredWork: [],
    events: [],
  },
  {
    slug: "sample-artist-five",
    name: "Sample Artist Five (placeholder)",
    group: "member",
    location: "Placeholder Heights, IL",
    medium: "Mixed media",
    bio: PLACEHOLDER_BIO,
    social: [{ label: "Website", href: "https://example.com" }],
    featuredWork: [{ title: "Untitled Study No. 4", year: "2022" }],
    events: [],
  },
];

export interface FounderLink {
  name: string;
  slug: string;
}

type CmsBlock = { _type?: string; children?: { text?: string }[] };

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
  bio?: CmsBlock[] | null;
  links?: Partial<Record<"website" | "instagram" | "facebook" | "youtube" | "blog", string | null>> | null;
  featuredArtworks?: { title?: string | null; year?: string | number | null; medium?: string | null }[] | null;
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
    bio: (m.bio ?? [])
      .filter((b) => b._type === "block")
      .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
      .filter(Boolean),
    portraitUrl: portrait?.src,
    social: LINK_LABELS.flatMap(([key, label]) => {
      const href = m.links?.[key];
      return href ? [{ label, href }] : [];
    }),
    featuredWork: (m.featuredArtworks ?? []).flatMap((a) =>
      a.title ? [{ title: a.title, year: a.year != null ? String(a.year) : undefined, medium: a.medium ?? undefined }] : [],
    ),
    events: (m.events ?? []).flatMap((e) => (e.title && e.slug ? [{ title: e.title, href: `/events/${e.slug}` }] : [])),
  };
}

const FALLBACK_FOUNDERS = (): FounderLink[] =>
  MEMBERS.filter((m) => m.isFounder).map((m) => ({ name: m.name, slug: m.slug }));

export async function getMembers(): Promise<Member[]> {
  const cms = await safeFetch<CmsMember[] | null>(MEMBERS_QUERY, {}, null);
  return cms?.length ? cms.map(fromCms) : MEMBERS;
}

export async function getMemberBySlug(slug: string): Promise<Member | null> {
  const cms = await safeFetch<CmsMember | null>(MEMBER_QUERY, { slug }, null);
  if (cms) return fromCms(cms);
  return MEMBERS.find((m) => m.slug === slug) ?? null;
}

/** Founding members (name + slug), ordered, for the header dropdown. */
export async function getFounders(): Promise<FounderLink[]> {
  const cms = await safeFetch<FounderLink[] | null>(FOUNDERS_QUERY, {}, null);
  return cms?.length ? cms : FALLBACK_FOUNDERS();
}
