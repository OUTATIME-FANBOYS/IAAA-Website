import { readText } from "@/lib/form";

/** Parsing and validation of the member profile form. Pure functions, no network. */

export const LINK_KEYS = ["website", "instagram", "facebook", "youtube", "blog"] as const;
export type LinkKey = (typeof LINK_KEYS)[number];

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export interface ProfileValue {
  name: string;
  location: string;
  medium: string;
  bio: string;
  statement: string;
  links: Partial<Record<LinkKey, string>>;
  photoAlt: string;
}

export type FieldError = "required" | "link" | "photo" | "alt";
export type ProfileErrors = Partial<Record<"name" | "bio" | "photo" | "photoAlt" | LinkKey, FieldError>>;

const LIMITS = { name: 100, location: 100, medium: 150, bio: 6000, statement: 4000, link: 300, alt: 200 };

/** Only full https addresses are accepted, so a profile can never carry a javascript: or data: link. */
export function cleanLink(raw: string): string | null {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export interface ParseOptions {
  /** True when the member already has a photo on the site, so a new one is optional. */
  hasExistingPhoto: boolean;
}

export type ParseResult =
  | { ok: true; value: ProfileValue; photo: File | null }
  | { ok: false; errors: ProfileErrors; values: Record<string, string> };

export function parseProfile(data: FormData, { hasExistingPhoto }: ParseOptions): ParseResult {
  const value: ProfileValue = {
    name: readText(data, "name", LIMITS.name),
    location: readText(data, "location", LIMITS.location),
    medium: readText(data, "medium", LIMITS.medium),
    bio: readText(data, "bio", LIMITS.bio),
    statement: readText(data, "statement", LIMITS.statement),
    links: {},
    photoAlt: readText(data, "photoAlt", LIMITS.alt),
  };
  const errors: ProfileErrors = {};
  if (!value.name) errors.name = "required";
  if (!value.bio) errors.bio = "required";

  for (const key of LINK_KEYS) {
    const raw = readText(data, key, LIMITS.link);
    if (!raw) continue;
    const link = cleanLink(raw);
    if (link) value.links[key] = link;
    else errors[key] = "link";
  }

  const file = data.get("photo");
  const photo = file instanceof File && file.size > 0 ? file : null;
  if (!photo && !hasExistingPhoto) errors.photo = "required";
  if (photo && photo.size > MAX_PHOTO_BYTES) errors.photo = "photo";
  if (photo && !value.photoAlt) errors.photoAlt = "alt";

  if (Object.keys(errors).length > 0) {
    const values: Record<string, string> = {
      name: value.name,
      location: value.location,
      medium: value.medium,
      bio: value.bio,
      statement: value.statement,
      photoAlt: value.photoAlt,
    };
    for (const key of LINK_KEYS) values[key] = readText(data, key, LIMITS.link);
    return { ok: false, errors, values };
  }
  return { ok: true, value, photo };
}

/** Identifies the real image type from the first bytes, ignoring the file name and the browser's claim. */
export function sniffImage(bytes: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}

const key = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

/** Plain text to Portable Text: one normal block per paragraph (blank line between paragraphs). */
export function textToBlocks(input: string) {
  return input
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean)
    .map((p) => ({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: p, marks: [] }],
    }));
}

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
