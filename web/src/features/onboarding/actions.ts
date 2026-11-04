"use server";

import { getWriteClient } from "@/sanity/lib/write-client";
import { resolveInvite } from "./invite";
import {
  MAX_PHOTO_BYTES,
  parseProfile,
  slugify,
  sniffImage,
  textToBlocks,
  type ProfileErrors,
  type ProfileValue,
} from "./profile";

export interface ProfileState {
  status: "idle" | "success" | "invalid" | "error";
  errors?: ProfileErrors;
  /** What was typed, handed back on an error (React clears forms after an action). */
  values?: Record<string, string>;
}

/** A member id that no published or draft member already uses. */
async function freshMemberId(client: NonNullable<ReturnType<typeof getWriteClient>>, name: string) {
  const base = slugify(name) || "member";
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const id = `member-${slug}`;
    const taken = await client.fetch<number>(
      `count(*[_type == "member" && (_id in [$id, $draft] || slug.current == $slug)])`,
      { id, draft: `drafts.${id}`, slug },
    );
    if (!taken) return { id, slug };
  }
  const slug = `${base}-${crypto.randomUUID().slice(0, 6)}`;
  return { id: `member-${slug}`, slug };
}

/**
 * Saves a submitted profile as an UNPUBLISHED member draft for the admins to review in Studio.
 * Nothing here publishes: the public site only shows published documents.
 */
export async function submitProfile(_prev: ProfileState, data: FormData): Promise<ProfileState> {
  // Spam trap: real visitors never see this field.
  if (data.get("company")) return { status: "success" };

  const token = data.get("invite");
  const invite = await resolveInvite(typeof token === "string" ? token : null);
  const client = getWriteClient();
  if (!invite || !client) return { status: "invalid" };

  const parsed = parseProfile(data, { hasExistingPhoto: invite.hasExistingPhoto });
  if (!parsed.ok) return { status: "error", errors: parsed.errors, values: parsed.values };
  const { value, photo } = parsed;
  const retry = (errors: ProfileErrors = {}): ProfileState => ({ status: "error", errors, values: valuesOf(value) });

  try {
    let photoField: Record<string, unknown> | null = null;
    if (photo) {
      const bytes = new Uint8Array(await photo.arrayBuffer());
      const type = bytes.length <= MAX_PHOTO_BYTES ? sniffImage(bytes) : null;
      if (!type) return retry({ photo: "photo" });
      const asset = await client.assets.upload("image", Buffer.from(bytes), { contentType: type, filename: "profile" });
      photoField = { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt: value.photoAlt };
    }

    const published = invite.memberId
      ? await client.getDocument<Record<string, unknown>>(invite.memberId)
      : null;
    if (invite.forExistingMember && !published && !invite.prefill) return { status: "invalid" };

    let memberId = invite.memberId;
    let slug: string | null = null;
    if (!memberId) {
      ({ id: memberId, slug } = await freshMemberId(client, value.name));
    }
    const draftId = `drafts.${memberId}`;

    // Empty optional fields are removed from the draft rather than saved as empty text.
    const optional: Record<string, unknown> = {
      location: value.location || null,
      tagline: value.medium || null,
      artistStatement: value.statement || null,
      links: Object.keys(value.links).length ? value.links : null,
    };
    const set: Record<string, unknown> = {
      name: value.name,
      bio: textToBlocks(value.bio),
      submittedAt: new Date().toISOString(),
      ...Object.fromEntries(Object.entries(optional).filter(([, v]) => v !== null)),
      ...(photoField ? { photo: photoField } : {}),
    };
    const unset = Object.keys(optional).filter((k) => optional[k] === null);

    const tx = client.transaction();
    if (published) {
      // Start the draft from the live profile so publishing it keeps every field the form does not touch.
      const rest = Object.fromEntries(Object.entries(published).filter(([k]) => !k.startsWith("_") || k === "_type"));
      tx.createIfNotExists({ ...rest, _id: draftId, _type: "member" });
    } else {
      tx.createIfNotExists({
        _id: draftId,
        _type: "member",
        name: value.name,
        slug: { _type: "slug", current: slug ?? memberId.replace(/^member-/, "") },
        group: "member",
      });
    }
    tx.patch(draftId, (p) => (unset.length ? p.set(set).unset(unset) : p.set(set)));
    tx.patch(invite.inviteId, (p) => p.set({ memberId, lastSubmittedAt: new Date().toISOString() }));
    await tx.commit();
    return { status: "success" };
  } catch (error) {
    console.error("Member onboarding: saving the profile failed:", (error as Error).message);
    return retry();
  }
}

function valuesOf(v: ProfileValue): Record<string, string> {
  return {
    name: v.name,
    location: v.location,
    medium: v.medium,
    bio: v.bio,
    statement: v.statement,
    photoAlt: v.photoAlt,
    ...(v.links as Record<string, string>),
  };
}
