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
  it("returns shell content: nav, band, footer links, logo and labels", async () => {
    const r = await run(Q.SITE_SETTINGS_QUERY);
    expect(r.siteTitle).toBe("IAAA");
    expect(r.navigation[0]).toMatchObject({ label: "Home", href: "/" });
    expect(r.membershipBand).toMatchObject({ heading: "Join", hiddenOnPaths: ["/"] });
    expect(r.supportLink).toMatchObject({ label: "Give", href: "/give" });
    expect(r.socialLinks[0]).toMatchObject({ icon: "instagram", label: "Insta" });
    expect(r.logo.alt).toBe("Logo");
    expect(r.labels).toEqual({ memberBack: "Back" });
  });
  it("returns null when no document", async () => {
    expect(await run(Q.SITE_SETTINGS_QUERY, {}, [])).toBeNull();
  });
});

describe("pages", () => {
  it("PAGE_QUERY resolves home section variants", async () => {
    const r = await run(Q.PAGE_QUERY, { slug: "home" });
    expect(r.pageBuilder.map((s: any) => s._type)).toEqual([
      "hero", "newsSection", "newsSection", "instagramSection", "waysSection", "linkListSection", "richTextSection",
    ]);
    const hero = r.pageBuilder[0];
    expect(hero.cta).toMatchObject({ label: "Go", href: "/g", style: "primary" });
    expect(hero.chips).toEqual(["c1"]);
    expect(hero.image.alt).toBe("Hero alt");
    expect(r.pageBuilder[3]).toMatchObject({ profileUrl: "https://i", postCount: 6, tone: "pacific" });
    expect(r.pageBuilder[4].cards[0].button.href).toBe("/b");
  });
  it("newsSection falls back to all news ordered (manual order first, then date desc)", async () => {
    const r = await run(Q.PAGE_QUERY, { slug: "home" });
    expect(r.pageBuilder[1].items.map((i: any) => i._id)).toEqual(["n3", "n2", "n1"]);
    expect(r.pageBuilder[1].tone).toBe("blossom");
  });
  it("newsSection uses curated items when set", async () => {
    const r = await run(Q.PAGE_QUERY, { slug: "home" });
    expect(r.pageBuilder[2].items.map((i: any) => i._id)).toEqual(["n2"]);
  });
  it("PAGE_QUERY resolves template sections on other pages", async () => {
    const r = await run(Q.PAGE_QUERY, { slug: "about" });
    expect(r.title).toBe("About");
    expect(r.pageBuilder[0].cta.href).toBe("/");
    expect(r.pageBuilder[1]).toMatchObject({ columns: 3 });
    expect(r.pageBuilder[1].features[0]).toMatchObject({ title: "T", tag: "tag" });
    expect(r.pageBuilder[2].quotes[0]).toMatchObject({ label: "Mission", text: "Text" });
    expect(r.pageBuilder[3].channels[0].panel).toMatchObject({ copyValue: "a@b.c", copiedLabel: "Copied" });
    expect(r.pageBuilder[4]).toMatchObject({ mission: "M", popupTone: "blossom" });
    expect(r.pageBuilder[5]).toMatchObject({ allLabel: "All", countLabel: "{count}" });
  });
  it("PAGE_QUERY returns null for unknown slug", async () => {
    expect(await run(Q.PAGE_QUERY, { slug: "nope" })).toBeNull();
  });
  it("PAGE_SLUGS_QUERY excludes pages without slug", async () => {
    expect(await run(Q.PAGE_SLUGS_QUERY)).toEqual([{ slug: "home" }, { slug: "about" }]);
  });
});

describe("events", () => {
  it("EVENTS_QUERY orders newest first, uses the type label, projects flat slug", async () => {
    const r = await run(Q.EVENTS_QUERY);
    expect(r.map((e: any) => e._id)).toEqual(["e3", "e2", "e1"]);
    expect(r[0].type).toBe("Artist’s Retreat");
    expect(r[1].type).toBe("retreat");
    expect(r[2]).toMatchObject({ slug: "old-show", type: "Exhibition", summary: "S", location: "Hall City", dateLabel: "May 2019" });
    expect(r[2].sessions[0]).toMatchObject({ label: "Day 1", time: "10:00" });
    expect(r[2].heroImage.alt).toBe("Hero");
  });
  it("EVENT_QUERY returns description, figures, highlight and gallery", async () => {
    const r = await run(Q.EVENT_QUERY, { slug: "old-show" });
    expect(r.address).toBe("1 Main");
    expect(r.figures[0]).toMatchObject({ caption: "Cap", credit: "Photo: X" });
    expect(r.figures[0].image.alt).toBe("Fig");
    expect(r.highlight).toMatchObject({ title: "Haiku", lines: ["a", "b"] });
    expect(r.recapPhotos[0].alt).toBe("Recap");
  });
  it("EVENT_QUERY null for unknown slug; absent arrays are null", async () => {
    expect(await run(Q.EVENT_QUERY, { slug: "zzz" })).toBeNull();
    const r = await run(Q.EVENT_QUERY, { slug: "new-retreat" });
    expect(r.figures ?? null).toBeNull();
  });
});

describe("members", () => {
  it("MEMBERS_QUERY sorted by name, excludes slugless", async () => {
    const r = await run(Q.MEMBERS_QUERY);
    expect(r.map((m: any) => m.slug)).toEqual(["ana", "zed"]);
    expect(r[1]).toMatchObject({ name: "Zed Zebra", roleTitle: "Painter", group: "leadership" });
  });
  it("FOUNDERS_QUERY orders by founderOrder", async () => {
    expect((await run(Q.FOUNDERS_QUERY)).map((m: any) => m.slug)).toEqual(["ana", "zed"]);
  });
  it("MEMBER_QUERY returns links, featured artworks and events", async () => {
    const r = await run(Q.MEMBER_QUERY, { slug: "zed" });
    expect(r.links.website).toBe("https://z.example");
    expect(r.featuredArtworks[0]).toMatchObject({ _id: "a1", title: "Member piece", medium: "oil" });
    expect(r.events).toEqual([{ title: "Old Show", slug: "old-show" }]);
  });
  it("MEMBER_QUERY null for unknown", async () => {
    expect(await run(Q.MEMBER_QUERY, { slug: "nope" })).toBeNull();
  });
});

describe("org structure", () => {
  it("ROLES_QUERY resolves the person and orders by order", async () => {
    const r = await run(Q.ROLES_QUERY);
    expect(r.map((x: any) => x._id)).toEqual(["r2", "r1"]);
    expect(r[1]).toMatchObject({ title: "President", focus: "Vision", person: { name: "Zed Zebra", slug: "zed" } });
    expect(r[0].person ?? null).toBeNull();
  });
  it("PROGRAMS_QUERY orders by order and returns examples", async () => {
    const r = await run(Q.PROGRAMS_QUERY);
    expect(r.map((p: any) => p.name)).toEqual(["Atelier", "Zine"]);
    expect(r[0]).toMatchObject({ kind: "standing", example: "Ex" });
  });
});

describe("image alt always selected", () => {
  it("every image object returned carries the alt key (selected in projection)", async () => {
    const results = await Promise.all([
      run(Q.SITE_SETTINGS_QUERY), run(Q.PAGE_QUERY, { slug: "home" }), run(Q.EVENTS_QUERY),
      run(Q.EVENT_QUERY, { slug: "old-show" }), run(Q.MEMBERS_QUERY), run(Q.MEMBER_QUERY, { slug: "zed" }),
    ]);
    const imgs = results.flatMap((r) => images(r));
    expect(imgs.length).toBeGreaterThan(6);
    for (const i of imgs) expect(i).toHaveProperty("alt");
  });
});
