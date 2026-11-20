import { readText } from "@/lib/form";
import { sniffImage } from "./profile";

/** Parsing and validation of one artwork in the "Add your artworks" step. Pure functions, no network. */

/** Vercel caps request bodies at 4.5 MB, so one image (plus its text) must stay under that. */
export const MAX_ARTWORK_BYTES = 4 * 1024 * 1024;
/** Most artworks one member can upload through their invite link. */
export const MAX_ARTWORKS_PER_INVITE = 30;

const LIMITS = { title: 120, medium: 150, dimensions: 100, year: 10, description: 2000 };

export interface ArtworkValue {
  title: string;
  medium: string;
  dimensions: string;
  year: number | null;
  description: string;
}

export type ArtworkField = "image" | "title" | "medium" | "dimensions" | "year";
export type ArtworkFieldError = "required" | "image" | "year";
export type ArtworkErrors = Partial<Record<ArtworkField, ArtworkFieldError>>;

export type ArtworkParse =
  | { ok: true; value: ArtworkValue; image: File }
  | { ok: false; errors: ArtworkErrors; values: Record<string, string> };

/** Title, medium and dimensions are required; year and description are optional. */
export function parseArtwork(data: FormData, thisYear = new Date().getFullYear()): ArtworkParse {
  const text = {
    title: readText(data, "title", LIMITS.title),
    medium: readText(data, "medium", LIMITS.medium),
    dimensions: readText(data, "dimensions", LIMITS.dimensions),
    year: readText(data, "year", LIMITS.year),
    description: readText(data, "description", LIMITS.description),
  };
  const errors: ArtworkErrors = {};
  if (!text.title) errors.title = "required";
  if (!text.medium) errors.medium = "required";
  if (!text.dimensions) errors.dimensions = "required";

  let year: number | null = null;
  if (text.year) {
    const n = Number(text.year);
    if (/^\d{4}$/.test(text.year) && n >= 1800 && n <= thisYear + 1) year = n;
    else errors.year = "year";
  }

  const file = data.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;
  if (!image) errors.image = "required";
  else if (image.size > MAX_ARTWORK_BYTES) errors.image = "image";

  if (!image || Object.keys(errors).length > 0) {
    return { ok: false, errors, values: { ...text } };
  }
  return {
    ok: true,
    value: { title: text.title, medium: text.medium, dimensions: text.dimensions, year, description: text.description },
    image,
  };
}

/** The server accepts only real JPEG bytes within the size limit: the browser always sends a JPEG. */
export function isAcceptableArtworkImage(bytes: Uint8Array): boolean {
  return bytes.length > 0 && bytes.length <= MAX_ARTWORK_BYTES && sniffImage(bytes) === "image/jpeg";
}

/** Alt text is generated, never typed: "<title> by <artist name>". */
export function artworkAlt(title: string, artistName: string): string {
  return `${title} by ${artistName}`;
}

/** The part of a member id used in artwork ids: "member-ada-lovelace" becomes "ada-lovelace". */
export function artworkKey(memberId: string): string {
  const key = memberId
    .replace(/^member-/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return key || "member";
}

/** Published id of a new artwork, e.g. "artwork-ada-lovelace-3f9c1a2b7d4e". The draft adds the "drafts." prefix. */
export function newArtworkId(memberId: string, random = randomHex()): string {
  return `artwork-${artworkKey(memberId)}-${random}`;
}

/** Counts the artworks (draft or published) that this member's uploads created, using their id pattern. */
export function countArtworks(ids: string[], memberId: string): number {
  const pattern = new RegExp(`^(?:drafts\\.)?artwork-${artworkKey(memberId)}-[0-9a-f]{12}$`);
  return ids.filter((id) => pattern.test(id)).length;
}

/** Random part of an id: 12 hex characters. */
export function randomHex(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}
