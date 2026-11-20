import { describe, expect, it } from "vitest";
import {
  MAX_ARTWORK_BYTES,
  artworkAlt,
  artworkKey,
  countArtworks,
  isAcceptableArtworkImage,
  newArtworkId,
  parseArtwork,
} from "../artwork";

const form = (fields: Record<string, string | File>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};
const jpeg = (bytes = 10) => new File([new Uint8Array([0xff, 0xd8, 0xff, ...new Uint8Array(bytes)])], "a.jpg", { type: "image/jpeg" });
const valid = { title: "Blue Study", medium: "Oil on canvas", dimensions: "24 × 30 in", image: jpeg() };

describe("parseArtwork", () => {
  it("accepts a work with only the required fields and leaves year and description empty", () => {
    const result = parseArtwork(form(valid), 2026);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ title: "Blue Study", medium: "Oil on canvas", dimensions: "24 × 30 in", year: null, description: "" });
      expect(result.image.size).toBeGreaterThan(0);
    }
  });

  it("requires an image, title, medium and dimensions", () => {
    const result = parseArtwork(form({ title: " ", medium: "", dimensions: "" }), 2026);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toEqual({ image: "required", title: "required", medium: "required", dimensions: "required" });
  });

  it("accepts a four-digit year up to next year and rejects anything else", () => {
    const ok = parseArtwork(form({ ...valid, year: "2027" }), 2026);
    expect(ok.ok && ok.value.year).toBe(2027);
    for (const bad of ["2028", "1799", "99", "20x6", "2019.5", "20190"]) {
      const result = parseArtwork(form({ ...valid, year: bad }), 2026);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.year).toBe("year");
    }
  });

  it("rejects a file over the per-image limit", () => {
    const big = new File([new Uint8Array(MAX_ARTWORK_BYTES + 1)], "big.jpg", { type: "image/jpeg" });
    const result = parseArtwork(form({ ...valid, image: big }), 2026);
    expect(!result.ok && result.errors.image).toBe("image");
  });

  it("caps text lengths and trims whitespace", () => {
    const result = parseArtwork(form({ ...valid, title: "  " + "t".repeat(500) + "  ", description: "d".repeat(5000) }), 2026);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.title).toHaveLength(120);
      expect(result.value.description).toHaveLength(2000);
    }
  });

  it("ignores a text field that is sent as a file", () => {
    const result = parseArtwork(form({ ...valid, title: jpeg() }), 2026);
    expect(!result.ok && result.errors.title).toBe("required");
  });
});

describe("isAcceptableArtworkImage", () => {
  it("accepts JPEG bytes within the limit only", () => {
    expect(isAcceptableArtworkImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe(true);
    expect(isAcceptableArtworkImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(false);
    expect(isAcceptableArtworkImage(new TextEncoder().encode("<svg onload=alert(1)>"))).toBe(false);
    expect(isAcceptableArtworkImage(new Uint8Array(0))).toBe(false);
    const oversized = new Uint8Array(MAX_ARTWORK_BYTES + 1);
    oversized.set([0xff, 0xd8, 0xff]);
    expect(isAcceptableArtworkImage(oversized)).toBe(false);
  });
});

describe("artwork alt text and ids", () => {
  it("generates alt text from the title and artist name", () => {
    expect(artworkAlt("Blue Study", "Ada Lovelace")).toBe("Blue Study by Ada Lovelace");
  });

  it("derives a key from the member id", () => {
    expect(artworkKey("member-ada-lovelace")).toBe("ada-lovelace");
    expect(artworkKey("Weird Id!")).toBe("weird-id");
    expect(artworkKey("member-")).toBe("member");
  });

  it("builds a published id that the draft prefix can be added to", () => {
    expect(newArtworkId("member-ada", "0123456789ab")).toBe("artwork-ada-0123456789ab");
  });

  it("counts only artworks created by this member's uploads, draft or published", () => {
    const ids = [
      "drafts.artwork-ada-0123456789ab",
      "artwork-ada-fedcba987654",
      "artwork-ada-lovelace-0123456789ab", // a different member whose key starts with "ada"
      "artwork-ada-notahexidecimal",
      "drafts.artwork-bob-0123456789ab",
    ];
    expect(countArtworks(ids, "member-ada")).toBe(2);
  });
});
