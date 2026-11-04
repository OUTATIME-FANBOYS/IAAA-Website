import { describe, expect, it } from "vitest";
import { avatarUrl } from "../image";

const asset = { _type: "reference", _ref: "image-abc123-800x1000-jpg" };

describe("avatarUrl", () => {
  it("is undefined without an image", () => {
    expect(avatarUrl(null)).toBeUndefined();
    expect(avatarUrl({})).toBeUndefined();
  });
  it("makes a square crop, centred a little above the middle when there is no hotspot", () => {
    const url = avatarUrl({ asset }, 100)!;
    expect(url).toContain("w=100");
    expect(url).toContain("h=100");
    expect(url).toContain("fit=crop");
    expect(url).toContain("fp-x=0.5");
    expect(url).toContain("fp-y=0.35");
    expect(url).toContain("crop=focalpoint");
  });
  it("lets the editor's hotspot decide the crop", () => {
    const url = avatarUrl({ asset, hotspot: { x: 0.3, y: 0.2, width: 0.4, height: 0.4 } }, 100)!;
    expect(url).not.toContain("fp-y=0.35");
  });
});
