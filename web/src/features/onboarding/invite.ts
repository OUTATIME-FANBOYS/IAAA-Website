import { blocksToParagraphs } from "@/sanity/lib/text";
import { getWriteClient } from "@/sanity/lib/write-client";
import { LINK_KEYS, type LinkKey } from "./profile";

const TOKEN = /^[A-Za-z0-9_-]{20,64}$/;

export interface Prefill {
  name: string;
  location: string;
  medium: string;
  bio: string;
  statement: string;
  links: Partial<Record<LinkKey, string>>;
}

export interface InviteContext {
  /** Id of the invite draft, to record the submission on it. */
  inviteId: string;
  /** The member document this invite edits, if it is for an existing member or was already used once. */
  memberId: string | null;
  /** True for an invite created for a member who is already on the site. */
  forExistingMember: boolean;
  hasExistingPhoto: boolean;
  prefill: Prefill | null;
}

type InviteDoc = { _id: string; revoked?: boolean; expiresAt?: string; memberRef?: string; memberId?: string };
type MemberDoc = {
  _id: string;
  name?: string;
  location?: string;
  tagline?: string;
  bio?: Parameters<typeof blocksToParagraphs>[0];
  artistStatement?: string;
  links?: Partial<Record<LinkKey, string>>;
  photo?: { asset?: unknown } | null;
};

/**
 * Looks up an invite by the token in the link. Returns null for anything that is not a live invite:
 * wrong, expired or turned-off tokens, and invites that were published (those are public, so the token is burned).
 */
export async function resolveInvite(token: string | null | undefined): Promise<InviteContext | null> {
  if (!token || !TOKEN.test(token)) return null;
  const client = getWriteClient();
  if (!client) {
    console.error("Member onboarding: SANITY_API_WRITE_TOKEN is not set.");
    return null;
  }
  const invite = await client.fetch<InviteDoc | null>(
    `*[_type == "memberInvite" && token == $secret][0]{ _id, revoked, expiresAt, "memberRef": member._ref, memberId }`,
    { secret: token },
  );
  if (!invite || !invite._id.startsWith("drafts.") || invite.revoked) return null;
  if (!invite.expiresAt || Date.parse(invite.expiresAt) <= Date.now()) return null;

  const memberId = invite.memberRef ?? invite.memberId ?? null;
  let member: MemberDoc | null = null;
  if (memberId) {
    const docs = await client.fetch<MemberDoc[]>(`*[_type == "member" && _id in [$id, $draft]]`, {
      id: memberId,
      draft: `drafts.${memberId}`,
    });
    // The draft (a profile already submitted or being edited) wins over the published version.
    member = docs.find((d) => d._id.startsWith("drafts.")) ?? docs[0] ?? null;
    if (invite.memberRef && !member) return null;
  }

  return {
    inviteId: invite._id,
    memberId,
    forExistingMember: Boolean(invite.memberRef),
    hasExistingPhoto: Boolean(member?.photo?.asset),
    prefill: member
      ? {
          name: member.name ?? "",
          location: member.location ?? "",
          medium: member.tagline ?? "",
          bio: blocksToParagraphs(member.bio).join("\n\n"),
          statement: member.artistStatement ?? "",
          links: Object.fromEntries(LINK_KEYS.flatMap((k) => (member!.links?.[k] ? [[k, member!.links[k]]] : []))),
        }
      : null,
  };
}
