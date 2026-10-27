import { parse, evaluate } from "groq-js";

const img = (ref: string, alt?: string) => ({
  _type: "imageWithAlt",
  asset: { _type: "reference", _ref: ref },
  ...(alt !== undefined ? { alt } : {}),
});

export const dataset: any[] = [
  { _id: "m1", _type: "member", name: "Zed Zebra", slug: { current: "zed" }, roleTitle: "Painter", group: "founding", tagline: "t", photo: img("image-z-1x1-jpg", "Zed portrait"), bio: [], links: { website: "https://z.example" }, featuredArtworks: [{ _type: "reference", _ref: "a1", _key: "k1" }] },
  { _id: "m2", _type: "member", name: "Ana Alpha", slug: { current: "ana" }, group: "member", photo: img("image-a-1x1-jpg", "Ana portrait") },
  { _id: "m3", _type: "member", name: "No Slug" },
  { _id: "a1", _type: "artwork", title: "Member piece", image: img("image-p1-1x1-jpg", "Piece one"), artist: { artistType: "member", member: { _type: "reference", _ref: "m1" } }, series: "S", medium: "oil", year: 2020 },
  { _id: "a2", _type: "artwork", title: "Guest piece", image: img("image-p2-1x1-jpg", "Piece two"), artist: { artistType: "name", name: "Guest Gail" } },
  { _id: "e1", _type: "event", title: "Old Show", slug: { current: "old-show" }, year: 2019, type: "exhibition", venue: "Hall", sessions: [{ _key: "s1", label: "Day 1", date: "2019-05-01", time: "10:00" }], heroImage: img("image-h1-1x1-jpg", "Hero"), artworks: [{ _type: "reference", _ref: "a1", _key: "r1" }, { _type: "reference", _ref: "a2", _key: "r2" }], recapPhotos: [{ _key: "p1", ...img("image-r1-1x1-jpg", "Recap") }], address: "1 Main", videoUrl: "https://v.example" },
  { _id: "e2", _type: "event", title: "New Retreat", slug: { current: "new-retreat" }, year: 2024, type: "retreat" },
  { _id: "e3", _type: "event", title: "Alpha Retreat", slug: { current: "alpha" }, year: 2024 },
  { _id: "e4", _type: "event", title: "No slug event", year: 2022 },
  { _id: "n1", _type: "newsItem", title: "Dated old", url: "https://n/1", date: "2024-01-01", image: img("image-n1-1x1-jpg", "N1") },
  { _id: "n2", _type: "newsItem", title: "Dated new", url: "https://n/2", date: "2025-01-01" },
  { _id: "n3", _type: "newsItem", title: "Manual first", url: "https://n/3", date: "2020-01-01", order: 1 },
  { _id: "r1", _type: "role", title: "President", group: "leadership", person: { _type: "reference", _ref: "m1" } },
  { _id: "r2", _type: "role", title: "Vacant", group: "advisory" },
  { _id: "p1", _type: "program", name: "Zine", kind: "popup", description: "d" },
  { _id: "p2", _type: "program", name: "Atelier", kind: "standing", icon: img("image-i-1x1-jpg", "Icon") },
  { _id: "siteSettings", _type: "siteSettings", siteTitle: "IAAA", navigation: [{ _key: "n", label: "Home", href: "/" }], membershipBand: { heading: "Join" }, footerLinks: [{ _key: "f", label: "X", href: "/x" }] },
  { _id: "pg-home", _type: "page", title: "Home", slug: { current: "home" }, pageBuilder: [
    { _key: "h", _type: "hero", heading: "Hi", cta: { label: "Go", href: "/g" }, image: img("image-hh-1x1-jpg", "Hero alt") },
    { _key: "ns", _type: "newsSection", heading: "News" },
    { _key: "nsm", _type: "newsSection", heading: "Curated", items: [{ _type: "reference", _ref: "n2", _key: "i1" }] },
    { _key: "ll", _type: "linkListSection", heading: "Links", links: [{ _key: "l", label: "A", href: "/a" }] },
    { _key: "rt", _type: "richTextSection", heading: "RT", body: [] },
  ] },
  { _id: "pg-about", _type: "page", title: "About", slug: { current: "about" }, pageBuilder: [{ _key: "c", _type: "ctaSection", heading: "C", text: "t", cta: { label: "L", href: "/" } }, { _key: "fg", _type: "featureGrid", heading: "F", features: [{ _key: "x", title: "T", description: "D" }] }] },
  { _id: "pg-noslug", _type: "page", title: "Draft" },
];

export async function run<T = any>(query: string, params: Record<string, unknown> = {}, ds = dataset): Promise<T> {
  const tree = parse(query, { params });
  const result = await evaluate(tree, { dataset: ds, params });
  return (await result.get()) as T;
}
