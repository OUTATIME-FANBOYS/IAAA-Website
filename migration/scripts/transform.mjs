/**
 * Transforms ./extracted into Sanity-shaped documents (./transformed/docs.json) plus a report.
 * Deterministic ids, so loads are idempotent. Images stay as { __file } placeholders until load.
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { ROOT, readPages, key, slugify, blocksToPortableText, plainBlock, matchMember, MEDIUM_RE, splitMedium, stripQuotes } from "./lib.mjs";

const report0 = [];
const pages = readPages();
const members = JSON.parse(readFileSync(ROOT + "reports/members.json", "utf8")); // [{_id,name,slug}] from the target dataset
const newsItems = JSON.parse(readFileSync(ROOT + "reports/news.json", "utf8")); // [{_id,title}]
const docs = [];

// Member pages on the old site with no member document yet: create the member from the page.
for (const page of Object.values(pages)) {
  const m = page.path.match(/^\/member-bios\/(?:founding-members|members)\/([^/]+)$/);
  if (!m) continue;
  const slug = m[1].replace(/_\d+$/, "");
  if (members.some((x) => x.slug === slug || x.slug === m[1])) continue;
  const h1 = page.blocks.find((b) => b.type === "h1");
  const name = h1 ? h1.text.replace(/,.*$/, "").trim() : page.title.replace(/^Indian American Artists Association - /, "");
  const doc = { _id: `member-${slug}`, name, slug, group: "member" };
  members.push(doc);
  docs.push({ ...doc, _type: "member", slug: { _type: "slug", current: slug }, isFounder: false, legacyUrl: page.path });
  report0.push({ created: name, slug });
}
const memberBySlug = Object.fromEntries(members.flatMap((m) => [[m.slug, m]]));
for (const page of Object.values(pages)) {
  const m = page.path.match(/^\/member-bios\/(?:founding-members|members)\/([^/]+)$/);
  if (m && !memberBySlug[m[1]]) memberBySlug[m[1]] = memberBySlug[m[1].replace(/_\d+$/, "")];
}

const patches = []; // { id, set?, setIfMissing?, ... } applied to documents that already exist
const report = { createdMembers: report0, members: [], events: [], pages: [], news: [], artworks: 0, skipped: [], lowConfidence: [] };
const img = (file, alt) => ({ __file: file, alt });
const isShortCaption = (b) => b && b.type === "p" && b.text.length <= 140;

/** Walk blocks; return [{ image, caption?, following[] }] for each image and the non-image text blocks. */
function groupImages(blocks) {
  const items = [];
  const text = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "image") continue;
    const following = [];
    for (let j = i + 1; j < blocks.length && !["image", "h1", "h2", "h3", "h4", "embed"].includes(blocks[j].type); j++) following.push(blocks[j]);
    items.push({ index: i, image: b, following });
  }
  return { items, text };
}

// ---------------------------------------------------------------- members
for (const [name, page] of Object.entries(pages)) {
  const m = page.path.match(/^\/member-bios\/(?:founding-members|members)\/([^/]+)$/);
  if (!m) continue;
  const slug = m[1];
  const member = memberBySlug[slug];
  if (!member) {
    report.skipped.push({ path: page.path, reason: "no member document with this slug" });
    continue;
  }
  const blocks = page.blocks;
  const images = blocks.filter((b) => b.type === "image");
  if (images.length === 0) {
    report.members.push({ slug, portrait: false, artworks: 0 });
    continue;
  }
  const portrait = images[0];
  const embed = blocks.find((b) => b.type === "embed" && /youtube\.com\/embed\//.test(b.src));
  const videoId = embed?.src.match(/embed\/([\w-]+)/)?.[1];

  // bio paragraphs = text between the portrait and the first artwork image (headings kept out)
  const pIdx = blocks.indexOf(portrait);
  const nextImg = blocks.findIndex((b, i) => i > pIdx && b.type === "image");
  const bioBlocks = blocks.slice(pIdx + 1, nextImg === -1 ? blocks.length : nextImg).filter((b) => b.type === "p" && b.text.length > 0);

  const artworkRefs = [];
  const rest = blocks.slice(pIdx + 1);
  const { items } = groupImages(rest);
  items.forEach((it, n) => {
    const caps = it.following.filter((b) => b.type === "p");
    let title, medium, dimensions, description;
    if (caps.length && caps[0].text.length <= 120) {
      title = stripQuotes(caps[0].text);
      if (caps[1] && caps[1].text.length <= 100 && MEDIUM_RE.test(caps[1].text)) {
        ({ medium, dimensions } = splitMedium(caps[1].text));
        const more = caps.slice(2).map((c) => c.text).join("\n\n");
        if (more) description = more;
      }
    } else if (caps.length) {
      report.lowConfidence.push({ path: page.path, note: "image followed by long text only; kept image without title" });
    }
    const id = `artwork-${slug}-${String(n + 1).padStart(2, "0")}`;
    docs.push({
      _id: id,
      _type: "artwork",
      image: img(it.image.file, title ? `${title} by ${member.name}` : `Artwork by ${member.name}`),
      ...(title ? { title } : {}),
      artist: { _type: "object", artistType: "member", member: { _type: "reference", _ref: member._id } },
      ...(medium ? { medium } : {}),
      ...(dimensions ? { dimensions } : {}),
      ...(description ? { description } : {}),
      legacyUrl: page.path,
    });
    artworkRefs.push({ _type: "reference", _ref: id, _key: key(id) });
    report.artworks++;
  });

  patches.push({
    id: member._id,
    set: {
      photo: img(portrait.file, `Portrait of ${member.name}`),
      featuredArtworks: artworkRefs,
      legacyUrl: page.path,
      ...(videoId ? { videoUrl: `https://www.youtube.com/watch?v=${videoId}` } : {}),
    },
    bioFallback: bioBlocks.length ? bioBlocks.map((b, i) => blocksToPortableText([b], `bio-${slug}-${i}`)[0]) : null,
  });
  report.members.push({ slug, portrait: true, artworks: artworkRefs.length, video: !!videoId, bioFallback: bioBlocks.length });
}

// ---------------------------------------------------------------- events
const EVENT_PAGES = Object.values(pages).filter((p) => /^\/events\/[^/]+$/.test(p.path));
const existingEvents = new Set(["great-elephant-migration", "2026-artist-retreat", "2025-artist-retreat"]);
const typeOf = (slug, title) => (/retreat/i.test(slug) ? "retreat" : /exhibit|exhibition|migration/i.test(slug + title) ? "exhibition" : /workshop|meeting/i.test(slug) ? "workshop" : "other");

for (const page of EVENT_PAGES) {
  const slug = page.path.split("/")[2];
  const blocks = page.blocks;
  const h1 = blocks.find((b) => b.type === "h1");
  const title = page.title.replace(/^Indian American Artists Association - /, "").replace(/\s+/g, " ").trim() || (h1 ? stripQuotes(h1.text) : slug);
  const year = Number((slug + title).match(/20\d\d/)?.[0]) || undefined;
  const id = `event-${slug}`;
  const { items } = groupImages(blocks);
  const artworkRefs = [];
  const photos = [];
  items.forEach((it, n) => {
    const cap = it.following.find((b) => b.type === "p" && isShortCaption(b));
    if (cap && / [-–—] /.test(cap.text) && it.following.length === 1) {
      const [t, ...a] = cap.text.split(/ [-–—] /);
      const artistName = a.join(" - ").trim();
      const mem = matchMember(artistName, members);
      const aid = `artwork-${slug}-${String(n + 1).padStart(2, "0")}`;
      docs.push({
        _id: aid,
        _type: "artwork",
        image: img(it.image.file, `${stripQuotes(t)} by ${artistName}`),
        title: stripQuotes(t),
        artist: mem
          ? { _type: "object", artistType: "member", member: { _type: "reference", _ref: mem._id } }
          : { _type: "object", artistType: "name", name: artistName },
        legacyUrl: page.path,
      });
      artworkRefs.push({ _type: "reference", _ref: aid, _key: key(aid) });
      report.artworks++;
      if (!mem) report.lowConfidence.push({ path: page.path, note: `artist "${artistName}" not matched to a member` });
    } else {
      photos.push(it);
    }
  });
  const imageSet = new Set(items.map((i) => i.image));
  const description = blocksToPortableText(
    blocks.filter((b) => ["p", "h2", "h3", "h4", "li"].includes(b.type) && !items.some((it) => it.following.length === 1 && it.following[0] === b && / [-–—] /.test(b.text))),
    `event-${slug}`,
  );
  const hero = photos[0];
  const recap = photos.slice(1);
  const base = {
    title,
    slug: { _type: "slug", current: slug },
    ...(year ? { year } : {}),
    type: typeOf(slug, title),
    legacyUrl: page.path,
  };
  if (existingEvents.has(slug)) {
    patches.push({
      id,
      set: { legacyUrl: page.path, ...(artworkRefs.length ? { artworks: artworkRefs } : {}), ...(hero ? { heroImage: img(hero.image.file, title) } : {}), ...(recap.length ? { recapPhotos: recap.map((r, i) => ({ _key: key(slug + "r" + i), ...img(r.image.file, `${title} photo ${i + 1}`) })) } : {}) },
      descriptionFallback: description.length ? description : null,
    });
  } else {
    docs.push({
      _id: id,
      _type: "event",
      ...base,
      ...(description.length ? { description } : {}),
      ...(hero ? { heroImage: img(hero.image.file, title) } : {}),
      ...(recap.length ? { recapPhotos: recap.map((r, i) => ({ _key: key(slug + "r" + i), ...img(r.image.file, `${title} photo ${i + 1}`) })) } : {}),
      ...(artworkRefs.length ? { artworks: artworkRefs } : {}),
    });
  }
  report.events.push({ slug, title, year, artworks: artworkRefs.length, photos: photos.length, paragraphs: description.length });
}

// ---------------------------------------------------------------- Great Elephant Migration artwork pages
const gemRefs = [];
for (const page of Object.values(pages)) {
  const m = page.path.match(/^\/events\/great-elephant-migration\/(\d+)-([\w-]+)$/);
  if (!m) continue;
  const blocks = page.blocks;
  const title = blocks.find((b) => b.type === "h1");
  const artistH = blocks.find((b) => b.type === "h2");
  const images = blocks.filter((b) => b.type === "image");
  if (!title || !images.length) {
    report.skipped.push({ path: page.path, reason: "no title or image" });
    continue;
  }
  const find = (re) => blocks.find((b) => b.type === "p" && re.test(b.text));
  const mediumLine = find(/^Medium\b/i);
  const dimLine = find(/^Dimensions?\b/i);
  const descIdx = blocks.findIndex((b) => b.type === "p" && /^Description of Artwork/i.test(b.text));
  const stop = blocks.findIndex((b, i) => i > descIdx && (b.type !== "p" || /^Price\b/i.test(b.text)));
  const descParas = descIdx >= 0 ? blocks.slice(descIdx + 1, stop === -1 ? blocks.length : stop).filter((b) => b.type === "p").map((b) => b.text) : [];
  let artistName = artistH?.text.trim();
  if (/^artist pictures?$/i.test(artistName ?? "")) {
    report.skipped.push({ path: page.path, reason: "community photo page, not an artwork" });
    continue;
  }
  let titleBlock = title;
  if (!(artistName && matchMember(artistName, members)) && matchMember(title.text, members) && artistH) {
    // some pages put the artist in the H1 and the title in the H2
    titleBlock = artistH;
    artistName = title.text.trim();
  }
  const mem = artistName ? matchMember(artistName, members) : null;
  const id = `artwork-gem-${m[1]}-${slugify(titleBlock.text).slice(0, 40)}`;
  const after = (l) => l?.text.replace(/^[^-–—:]+[-–—:]\s*/, "").trim();
  docs.push({
    _id: id,
    _type: "artwork",
    image: img(images[0].file, `${stripQuotes(titleBlock.text)}${artistName ? ` by ${artistName}` : ""}`),
    title: stripQuotes(titleBlock.text),
    artist: mem
      ? { _type: "object", artistType: "member", member: { _type: "reference", _ref: mem._id } }
      : { _type: "object", artistType: "name", name: artistName ?? "Unknown" },
    series: m[2].replace(/^\w/, (c) => c.toUpperCase()),
    ...(mediumLine ? { medium: after(mediumLine) } : {}),
    ...(dimLine ? { dimensions: after(dimLine) } : {}),
    ...(descParas.length ? { description: descParas.join("\n\n") } : {}),
    year: 2026,
    legacyUrl: page.path,
  });
  gemRefs.push({ _type: "reference", _ref: id, _key: key(id) });
  report.artworks++;
  if (!mem) report.lowConfidence.push({ path: page.path, note: `artist "${artistName}" not matched to a member` });
}
if (gemRefs.length) {
  const p = patches.find((x) => x.id === "event-great-elephant-migration");
  p.set.artworks = gemRefs;
}

// ---------------------------------------------------------------- membership pages
for (const slug of ["why-be-a-member", "callforleads"]) {
  const page = pages[`membership__${slug}`];
  if (!page) continue;
  const h1 = page.blocks.find((b) => b.type === "h1");
  const body = blocksToPortableText(page.blocks.filter((b) => ["h2", "h3", "p", "li"].includes(b.type)), `membership-${slug}`);
  docs.push({
    _id: `page-membership-${slug}`,
    _type: "page",
    title: h1 ? h1.text : page.title,
    slug: { _type: "slug", current: `membership/${slug}` },
    legacyUrl: page.path,
    pageBuilder: [
      { _key: key(slug + "hero"), _type: "hero", heading: h1 ? h1.text : page.title },
      { _key: key(slug + "rt"), _type: "richTextSection", tone: "paper", body },
    ],
  });
  report.pages.push({ slug: `membership/${slug}`, blocks: body.length });
}
report.skipped.push({ path: "/membership/structure", reason: "Google Drawing embed only; the new Organization page replaces it" });

// ---------------------------------------------------------------- home news images
const home = pages["home"];
const STOP = new Set(["with", "interview", "featured", "completed", "showing", "booth", "resident", "national", "performance", "network", "art", "arts"]);
const norm = (s) => slugify(s).split("-").filter((t) => t.length > 3 && !STOP.has(t));
if (home) {
  const bs = home.blocks;
  bs.forEach((b, i) => {
    if (b.type !== "image") return;
    const cap = bs[i + 1]?.type === "p" ? bs[i + 1].text : "";
    const toks = new Set(norm(cap));
    let best = null;
    for (const n of newsItems) {
      const overlap = norm(n.title).filter((t) => toks.has(t)).length;
      if (overlap >= 2 && (!best || overlap > best.overlap)) best = { n, overlap };
    }
    if (best) {
      patches.push({ id: best.n._id, set: { image: img(b.file, best.n.title) } });
      report.news.push({ news: best.n.title, caption: cap });
    } else if (cap) report.skipped.push({ path: "/home", reason: `no matching news item for "${cap}" (image not imported)` });
  });
}

mkdirSync(ROOT + "transformed", { recursive: true });
writeFileSync(ROOT + "transformed/docs.json", JSON.stringify({ docs, patches }, null, 2));
report.summary = {
  documentsToCreate: docs.length,
  byType: docs.reduce((a, d) => ((a[d._type] = (a[d._type] ?? 0) + 1), a), {}),
  patches: patches.length,
  images: new Set(JSON.stringify({ docs, patches }).match(/"__file":"[^"]+"/g)).size,
  lowConfidence: report.lowConfidence.length,
  skipped: report.skipped.length,
};
writeFileSync(ROOT + "reports/transform.json", JSON.stringify(report, null, 2));
console.log(report.summary);
