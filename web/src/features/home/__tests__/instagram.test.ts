import { afterEach, describe, expect, it, vi } from "vitest";
import { getInstagramPosts } from "@/features/home";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const media = (over: Record<string, unknown>) => ({
  id: "1",
  media_type: "IMAGE",
  media_url: "https://cdn.example/a.jpg",
  permalink: "https://www.instagram.com/p/abc/",
  ...over,
});

describe("getInstagramPosts", () => {
  it("returns nothing without a token", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    expect(await getInstagramPosts(3)).toEqual([]);
  });

  it("keeps only posts whose link and image use https", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "t");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            media({ id: "ok" }),
            media({ id: "js", permalink: "javascript:alert(1)" }),
            media({ id: "http-image", media_url: "http://cdn.example/a.jpg" }),
            media({ id: "video", media_type: "VIDEO", media_url: undefined, thumbnail_url: "https://cdn.example/t.jpg" }),
          ],
        }),
      }),
    );
    const posts = await getInstagramPosts(6);
    expect(posts.map((p) => p.id)).toEqual(["ok", "video"]);
  });

  it("returns nothing when the request fails", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect(await getInstagramPosts(6)).toEqual([]);
  });
});
