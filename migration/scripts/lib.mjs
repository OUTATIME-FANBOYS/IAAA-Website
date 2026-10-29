import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const PAGES_DIR = ROOT + "extracted/pages/";

export const readPages = () =>
  Object.fromEntries(readdirSync(PAGES_DIR).filter((f) => f.endsWith(".json")).map((f) => [f.replace(/\.json$/, ""), JSON.parse(readFileSync(PAGES_DIR + f, "utf8"))]));

/** Deterministic short key. */
export const key = (s) => createHash("sha1").update(String(s)).digest("hex").slice(0, 10);

export const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Portable Text block from extracted segments (links, bold, italic preserved). */
export function toBlock(segments, style = "normal", seed = "") {
  const markDefs = [];
  const children = segments.map((s, i) => {
    const marks = [];
    if (s.strong) marks.push("strong");
    if (s.em) marks.push("em");
    if (s.href) {
      const k = key(seed + s.href + i);
      markDefs.push({ _key: k, _type: "link", href: s.href });
      marks.push(k);
    }
    return { _type: "span", _key: key(seed + "s" + i), text: s.text, marks };
  });
  return { _type: "block", _key: key(seed + "b"), style, markDefs, children };
}

export const plainBlock = (text, seed) => toBlock([{ text }], "normal", seed);

/** Blocks (h/p/li) of an extracted page -> Portable Text. Lists become bullet items. */
export function blocksToPortableText(blocks, seed) {
  return blocks.flatMap((b, i) => {
    if (b.type === "p") return [toBlock(b.segments, "normal", seed + i)];
    if (b.type === "h1" || b.type === "h2") return [toBlock(b.segments.map((s) => ({ ...s, strong: false })), "h2", seed + i)];
    if (b.type === "h3" || b.type === "h4") return [toBlock(b.segments.map((s) => ({ ...s, strong: false })), "h3", seed + i)];
    if (b.type === "li") return [{ ...toBlock(b.segments, "normal", seed + i), listItem: "bullet", level: 1 }];
    return [];
  });
}

const nameKey = (s) => slugify(s.replace(/\(.*?\)/g, ""));

/** Find a member whose name matches `name` (exact or first+last token match). */
export function matchMember(name, members) {
  const k = nameKey(name);
  if (!k) return null;
  const exact = members.find((m) => nameKey(m.name) === k);
  if (exact) return exact;
  const toks = k.split("-").filter(Boolean);
  if (toks.length < 2) return null;
  const hit = members.filter((m) => {
    const mt = nameKey(m.name).split("-");
    if (mt[0] !== toks[0]) return false;
    const last = toks[toks.length - 1];
    const mlast = mt[mt.length - 1];
    return (
      mt.length === 1 || // member listed by first name only
      mlast === last ||
      toks.every((t) => mt.includes(t)) || // "Pragati Sharma" vs "Pragati Sharma Mohanty"
      levenshtein(last, mlast) <= 1 // "Ghosh" vs "Ghose"
    );
  });
  return hit.length === 1 ? hit[0] : null;
}

function levenshtein(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export const MEDIUM_RE = /\b(oil|acrylic|canvas|watercolou?r|gouache|ink|pastel|charcoal|graphite|digital|print|photograph|mixed media|silk|ceramic|clay|bronze|wood|sculpture|textile|fabric|paper|inches|inch|cm|x\s?\d)/i;

/** "Oil on canvas - 30x30 inches" -> { medium, dimensions } */
export function splitMedium(line) {
  const parts = line.split(/\s[-–—]\s|,\s(?=\d)/).map((s) => s.trim()).filter(Boolean);
  const dims = parts.find((p) => /\d+\s?(x|×)\s?\d+/.test(p) || /inch|cm/i.test(p));
  const med = parts.filter((p) => p !== dims).join(", ");
  return { medium: med || undefined, dimensions: dims || undefined };
}

export const stripQuotes = (s) => s.replace(/^[\s"“”'‘’]+|[\s"“”'‘’]+$/g, "").trim();
