"use server";

import { honeypotTripped } from "@/lib/form";
import { verifyTurnstile } from "@/lib/turnstile";
import { getWriteClient } from "@/sanity/lib/write-client";
import {
  MAX_ARTWORKS_PER_INVITE,
  artworkAlt,
  artworkKey,
  countArtworks,
  isAcceptableArtworkImage,
  newArtworkId,
  parseArtwork,
  randomHex,
  type ArtworkErrors,
} from "./artwork";
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
  if (honeypotTripped(data)) return { status: "success" };

  const token = data.get("invite");
  const invite = await resolveInvite(typeof token === "string" ? token : null);
  const client = getWriteClient();
  if (!invite || !client) return { status: "invalid" };

  const parsed = parseProfile(data, { hasExistingPhoto: invite.hasExistingPhoto });
  if (!parsed.ok) return { status: "error", errors: parsed.errors, values: parsed.values };
  const { value, photo } = parsed;
  if (!(await verifyTurnstile(data))) return { status: "error", errors: {}, values: valuesOf(value) };
  const retry = (errors: ProfileErrors = {}): ProfileState => ({ status: "error", errors, values: valuesOf(value) });

  try {
    let photoField: Record<string, unknown> | null = null;
    if (photo) {
      photoField = await uploadPhoto(client, photo, value.photoAlt);
      if (!photoField) return retry({ photo: "photo" });
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

    const { set, unset } = buildDraftPatch(value, photoField);

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

type WriteClient = NonNullable<ReturnType<typeof getWriteClient>>;

/** Uploads the profile photo; null when the file is too big or is not really an image. */
async function uploadPhoto(client: WriteClient, photo: File, alt: string): Promise<Record<string, unknown> | null> {
  const bytes = new Uint8Array(await photo.arrayBuffer());
  const type = bytes.length <= MAX_PHOTO_BYTES ? sniffImage(bytes) : null;
  if (!type) return null;
  const asset = await client.assets.upload("image", Buffer.from(bytes), { contentType: type, filename: "profile" });
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt };
}

/** The fields to set on the draft; empty optional fields are removed from it rather than saved as empty text. */
function buildDraftPatch(value: ProfileValue, photoField: Record<string, unknown> | null) {
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
  return { set, unset };
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

export type ArtworkFailure = "fields" | "image" | "profile" | "limit" | "save";
export type ArtworkResult =
  | { status: "saved" }
  | { status: "invalid" }
  | { status: "error"; reason: ArtworkFailure; errors?: ArtworkErrors };

/**
 * Saves ONE artwork as a draft linked to the member's draft profile. The browser sends one image per call
 * (Vercel caps request bodies at 4.5 MB). Nothing here publishes: the admins review the drafts in Studio.
 */
export async function submitArtwork(data: FormData): Promise<ArtworkResult> {
  const token = data.get("invite");
  const invite = await resolveInvite(typeof token === "string" ? token : null);
  const client = getWriteClient();
  if (!invite || !client) return { status: "invalid" };
  // The profile must be saved first: the artwork hangs off the member's draft.
  if (!invite.memberId) return { status: "error", reason: "profile" };
  const memberId = invite.memberId;

  const parsed = parseArtwork(data);
  if (!parsed.ok) {
    const onlyImage = Object.keys(parsed.errors).length === 1 && parsed.errors.image === "image";
    return { status: "error", reason: onlyImage ? "image" : "fields", errors: parsed.errors };
  }
  const { value, image } = parsed;
  const bytes = new Uint8Array(await image.arrayBuffer());
  if (!isAcceptableArtworkImage(bytes)) return { status: "error", reason: "image", errors: { image: "image" } };

  try {
    const draftMemberId = `drafts.${memberId}`;
    const member = await client.fetch<{ name?: string } | null>(`*[_id == $draft][0]{ name }`, { draft: draftMemberId });
    const artistName = member?.name?.trim();
    if (!artistName) return { status: "error", reason: "profile" };

    const key = artworkKey(memberId);
    const existing = await client.fetch<string[]>(
      `*[_type == "artwork" && (_id in path($draftPath) || _id in path($livePath))]._id`,
      { draftPath: `drafts.artwork-${key}-*`, livePath: `artwork-${key}-*` },
    );
    if (countArtworks(existing, memberId) >= MAX_ARTWORKS_PER_INVITE) return { status: "error", reason: "limit" };

    const asset = await client.assets.upload("image", Buffer.from(bytes), { contentType: "image/jpeg", filename: "artwork.jpg" });
    const id = newArtworkId(memberId);
    const tx = client.transaction();
    tx.create({
      _id: `drafts.${id}`,
      _type: "artwork",
      image: {
        _type: "imageWithAlt",
        asset: { _type: "reference", _ref: asset._id },
        alt: artworkAlt(value.title, artistName),
      },
      title: value.title,
      medium: value.medium,
      dimensions: value.dimensions,
      ...(value.year !== null ? { year: value.year } : {}),
      ...(value.description ? { description: value.description } : {}),
      artist: { artistType: "member", member: { _type: "reference", _ref: memberId } },
    });
    tx.patch(draftMemberId, (p) =>
      p.setIfMissing({ featuredArtworks: [] }).append("featuredArtworks", [
        { _type: "reference", _ref: id, _key: randomHex() },
      ]),
    );
    await tx.commit();
    return { status: "saved" };
  } catch (error) {
    console.error("Member onboarding: saving an artwork failed:", (error as Error).message);
    return { status: "error", reason: "save" };
  }
}
