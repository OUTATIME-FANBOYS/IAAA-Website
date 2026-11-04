import { describe, expect, it } from "vitest";
import { cleanLink, parseProfile, slugify, sniffImage, textToBlocks } from "../profile";

const form = (fields: Record<string, string | File>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};
const photo = (bytes = 10) => new File([new Uint8Array(bytes)], "p.jpg", { type: "image/jpeg" });

describe("cleanLink", () => {
  it("accepts https addresses only", () => {
    expect(cleanLink("https://example.com/a")).toBe("https://example.com/a");
    expect(cleanLink("http://example.com")).toBeNull();
    expect(cleanLink("javascript:alert(1)")).toBeNull();
    expect(cleanLink("data:text/html,x")).toBeNull();
    expect(cleanLink("not a url")).toBeNull();
    expect(cleanLink("https://localhost")).toBeNull();
  });
});

describe("parseProfile", () => {
  it("requires name, biography and, for a new member, a photo with a description", () => {
    const result = parseProfile(form({ name: " ", bio: "" }), { hasExistingPhoto: false });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors).toMatchObject({ name: "required", bio: "required", photo: "required" });
    const noAlt = parseProfile(form({ name: "Ada", bio: "Hi", photo: photo() }), { hasExistingPhoto: false });
    expect(!noAlt.ok && noAlt.errors.photoAlt).toBe("alt");
  });

  it("lets an existing member keep their photo", () => {
    const result = parseProfile(form({ name: "Ada", bio: "Hi", photo: new File([], "") }), { hasExistingPhoto: true });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.photo).toBeNull();
  });

  it("rejects oversized photos and bad links, and hands back what was typed", () => {
    const result = parseProfile(
      form({ name: "Ada", bio: "Hi", website: "javascript:x", photoAlt: "me", photo: photo(5 * 1024 * 1024) }),
      { hasExistingPhoto: false },
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toMatchObject({ website: "link", photo: "photo" });
      expect(result.values.name).toBe("Ada");
    }
  });

  it("returns clean values", () => {
    const result = parseProfile(
      form({ name: " Ada ", bio: "Para", location: "Austin", instagram: "https://instagram.com/ada", photoAlt: "Ada", photo: photo() }),
      { hasExistingPhoto: false },
    );
    expect(result.ok && result.value).toMatchObject({ name: "Ada", location: "Austin", links: { instagram: "https://instagram.com/ada" } });
  });
});

describe("sniffImage", () => {
  it("recognises images by content, not by name", () => {
    expect(sniffImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(sniffImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe("image/png");
    expect(sniffImage(new TextEncoder().encode("RIFF0000WEBPVP8 "))).toBe("image/webp");
    expect(sniffImage(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(sniffImage(new TextEncoder().encode("GIF89a"))).toBeNull();
  });
});

describe("textToBlocks and slugify", () => {
  it("makes one block per paragraph", () => {
    const blocks = textToBlocks("One\nstill one\n\nTwo\n\n\n\nThree");
    expect(blocks.map((b) => b.children[0].text)).toEqual(["One still one", "Two", "Three"]);
    expect(blocks[0]).toMatchObject({ _type: "block", style: "normal" });
  });
  it("makes safe slugs", () => {
    expect(slugify("Ananya Chatterjee-Rao")).toBe("ananya-chatterjee-rao");
    expect(slugify("José  O'Brien")).toBe("jose-o-brien");
    expect(slugify("!!!")).toBe("");
  });
});
