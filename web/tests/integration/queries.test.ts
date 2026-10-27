import { describe, it, expect } from "vitest";
import * as Q from "@/sanity/lib/queries";
import { run } from "./fixtures";

/** Collect every object in `value` that looks like an image (has asset). */
function images(value: any, out: any[] = []): any[] {
  if (Array.isArray(value)) value.forEach((v) => images(v, out));
  else if (value && typeof value === "object") {
    if ("asset" in value && !("_ref" in value)) out.push(value);
    Object.values(value).forEach((v) => images(v, out));
  }
  return out;
}

describe("query parsing", () => {
  it.each(Object.entries(Q).filter(([, v]) => typeof v === "string"))("%s parses and evaluates", async (_n, q) => {
    await run(q as string, { slug: "x" });
  });
});

describe("siteSettings", () => {
  it("returns nav and membership band", async () => {
    const r = await run(Q.SITE_SETTINGS_QUERY);
    expect(r.siteTitle).toBe("IAAA");
    expect(r.navigation[0]).toMatchObject({ label: "Home", href: "/" });
    expect(r.membershipBand.heading).toBe("Join");
    expect(r.footerLinks).toHaveLength(1);
  });
  it("returns null when no document", async () => {
    expect(await run(Q.SITE_SETTINGS_QUERY, {}, [])).toBeNull();
  });
});

describe("pages", () => {
  it("HOME_PAGE_QUERY resolves section variants", async () => {
    const r = await run(Q.HOME_PAGE_QUERY);
    const types = r.pageBuilder.map((s: any) => s._type);
    expect(types).toEqual(["hero", "newsSection", "newsSection", "linkListSection", "richTextSection"]);
    const hero = r.pageBuilder[0];
    expect(hero.cta).toEqual({ label: "Go", href: "/g" });
    expect(hero.image.alt).toBe("Hero alt");
  });
  it("newsSection falls back to all news ordered (manual order first, then date desc)", async () => {
    const r = await run(Q.HOME_PAGE_QUERY);
    expect(r.pageBuilder[1].items.map((i: any) => i._id)).toEqual(["n3", "n2", "n1"]);
  });
  it("newsSection uses curated items when set", async () => {
    const r = await run(Q.HOME_PAGE_QUERY);
    expect(r.pageBuilder[2].items.map((i: any) => i._id)).toEqual(["n2"]);
  });
  it("PAGE_QUERY by slug incl. ctaSection/featureGrid", async () => {
    const r = await run(Q.PAGE_QUERY, { slug: "about" });
    expect(r.title).toBe("About");
    expect(r.pageBuilder[0].cta.href).toBe("/");
    expect(r.pageBuilder[1].features[0].title).toBe("T");
  });
  it("PAGE_QUERY returns null for unknown slug", async () => {
    expect(await run(Q.PAGE_QUERY, { slug: "nope" })).toBeNull();
  });
  it("PAGE_SLUGS_QUERY excludes pages without slug", async () => {
    expect(await run(Q.PAGE_SLUGS_QUERY)).toEqual([{ slug: "home" }, { slug: "about" }]);
  });
});

describe("news", () => {
  it("NEWS_ITEMS_QUERY ordering", async () => {
    const r = await run(Q.NEWS_ITEMS_QUERY);
    expect(r.map((n: any) => n._id)).toEqual(["n3", "n2", "n1"]);
  });
});

describe("events", () => {
  it("EVENTS_QUERY orders year desc then title asc, projects flat slug", async () => {
    const r = await run(Q.EVENTS_QUERY);
    expect(r.map((e: any) => e._id)).toEqual(["e3", "e2", "e4", "e1"]);
    expect(r[1].slug).toBe("new-retreat");
    expect(r[3].sessions[0]).toMatchObject({ label: "Day 1", time: "10:00" });
    expect(r[3].heroImage.alt).toBe("Hero");
  });
  it("EVENT_SLUGS_QUERY skips slugless", async () => {
    const r = await run(Q.EVENT_SLUGS_QUERY);
    expect(r.map((s: any) => s.slug).sort()).toEqual(["alpha", "new-retreat", "old-show"]);
  });
  it("EVENT_QUERY resolves artworks with member artist", async () => {
    const r = await run(Q.EVENT_QUERY, { slug: "old-show" });
    expect(r.address).toBe("1 Main");
    expect(r.recapPhotos[0].alt).toBe("Recap");
    const [member, guest] = r.artworks;
    expect(member).toMatchObject({ artistName: "Zed Zebra", artistSlug: "zed" });
    expect(member.image.alt).toBe("Piece one");
  });
  it("EVENT_QUERY resolves guest (plain-string) artist", async () => {
    const r = await run(Q.EVENT_QUERY, { slug: "old-show" });
    expect(r.artworks[1].artistName).toBe("Guest Gail");
    expect(r.artworks[1].artistSlug ?? null).toBeNull();
  });
  it("EVENT_QUERY null for unknown slug; absent arrays are null", async () => {
    expect(await run(Q.EVENT_QUERY, { slug: "zzz" })).toBeNull();
    const r = await run(Q.EVENT_QUERY, { slug: "new-retreat" });
    expect(r.artworks ?? null).toBeNull();
  });
});

describe("members", () => {
  it("MEMBERS_QUERY sorted by name, excludes slugless", async () => {
    const r = await run(Q.MEMBERS_QUERY);
    expect(r.map((m: any) => m.slug)).toEqual(["ana", "zed"]);
    expect(r[1]).toMatchObject({ name: "Zed Zebra", roleTitle: "Painter", group: "founding" });
  });
  it("MEMBER_SLUGS_QUERY", async () => {
    expect((await run(Q.MEMBER_SLUGS_QUERY)).map((s: any) => s.slug).sort()).toEqual(["ana", "zed"]);
  });
  it("MEMBER_QUERY returns bio, links, featured artworks and exhibited events", async () => {
    const r = await run(Q.MEMBER_QUERY, { slug: "zed" });
    expect(r.links.website).toBe("https://z.example");
    expect(r.featuredArtworks[0]).toMatchObject({ _id: "a1", title: "Member piece" });
    expect(r.featuredArtworks[0].image.alt).toBe("Piece one");
    expect(r.events).toEqual([{ _id: "e1", title: "Old Show", slug: "old-show", year: 2019 }]);
  });
  it("MEMBER_QUERY events empty for member with no artworks; null for unknown", async () => {
    expect((await run(Q.MEMBER_QUERY, { slug: "ana" })).events).toEqual([]);
    expect(await run(Q.MEMBER_QUERY, { slug: "nope" })).toBeNull();
  });
});

describe("org structure", () => {
  it("resolves role person and programs", async () => {
    const r = await run(Q.ORG_STRUCTURE_QUERY);
    expect(r.roles.find((x: any) => x._id === "r1").person).toMatchObject({ name: "Zed Zebra", slug: "zed" });
    expect(r.roles.find((x: any) => x._id === "r2").person ?? null).toBeNull();
    expect(r.programs.map((p: any) => p.name)).toEqual(["Atelier", "Zine"]);
  });
});

describe("image alt always selected", () => {
  it("every image object returned carries the alt key (selected in projection)", async () => {
    const results = await Promise.all([
      run(Q.HOME_PAGE_QUERY), run(Q.NEWS_ITEMS_QUERY), run(Q.EVENTS_QUERY),
      run(Q.EVENT_QUERY, { slug: "old-show" }), run(Q.MEMBERS_QUERY),
      run(Q.MEMBER_QUERY, { slug: "zed" }), run(Q.ORG_STRUCTURE_QUERY),
    ]);
    const imgs = results.flatMap((r) => images(r));
    expect(imgs.length).toBeGreaterThan(10);
    for (const i of imgs) expect(i).toHaveProperty("alt");
  });
});
