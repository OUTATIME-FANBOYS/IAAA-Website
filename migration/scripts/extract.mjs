/**
 * Extracts the legacy Google Sites site into ./extracted (read-only against the old site).
 *
 *   extracted/pages/<slug>.json   ordered content blocks per page (text with links, images)
 *   extracted/images/<hash>.<ext> every image, downloaded through a real browser session
 *   reports/extract.json          counts and problems
 *
 * The old site only serves images to a real browser (links are signed), so we crawl with
 * headless Chromium and capture the image responses. Re-run any time; it overwrites.
 */
import { chromium } from "playwright-core";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://www.indianamericanartists.org";
const OUT = fileURLToPath(new URL("../extracted/", import.meta.url));
const REPORTS = fileURLToPath(new URL("../reports/", import.meta.url));
const seeds = ["/home", "/member-bios"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT + "pages", { recursive: true });
mkdirSync(OUT + "images", { recursive: true });
mkdirSync(REPORTS, { recursive: true });

const slugOf = (path) => path.replace(/^\//, "").replace(/\//g, "__") || "home";
const baseOf = (u) => u.split("=")[0];
const extOf = (type) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg" })[type] ?? "bin";

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

/** url base -> { buffer, type } for every image response seen */
const captured = new Map();
page.on("response", async (r) => {
  const type = r.headers()["content-type"] ?? "";
  if (r.status() === 200 && type.startsWith("image/") && r.url().includes("googleusercontent")) {
    try {
      const buffer = await r.body();
      const prev = captured.get(baseOf(r.url()));
      if (!prev || buffer.length > prev.buffer.length) captured.set(baseOf(r.url()), { buffer, type });
    } catch {}
  }
});

const queue = [...seeds];
const seen = new Set();
const report = { pages: [], missingImages: [], notFound: [] };
const savedImages = new Map(); // base -> file

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await page.goto(ORIGIN + path, { waitUntil: "networkidle", timeout: 90000 }).catch((e) => ({ status: () => 0, error: e }));
  if (!res || res.status() !== 200) {
    report.notFound.push({ path, status: res?.status?.() ?? 0 });
    continue;
  }
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const data = await page.evaluate(() => {
    const skip = (el) => el.closest("nav, header, footer, [role=navigation], [role=banner]");
    const segments = (root) => {
      const out = [];
      const walk = (node, marks) => {
        if (node.nodeType === 3) {
          const text = node.textContent.replace(/\s+/g, " ");
          if (text.trim() || text === " ") out.push({ text, ...marks });
        } else if (node.nodeType === 1) {
          const tag = node.tagName.toLowerCase();
          let m = marks;
          if (tag === "a" && node.href) m = { ...m, href: node.href };
          if (tag === "strong" || tag === "b" || /^(700|600|bold)$/.test(getComputedStyle(node).fontWeight)) m = { ...m, strong: true };
          if (tag === "em" || tag === "i" || getComputedStyle(node).fontStyle === "italic") m = { ...m, em: true };
          if (tag === "br") out.push({ text: "\n" });
          for (const c of node.childNodes) walk(c, m);
        }
      };
      walk(root, {});
      // merge neighbours with the same marks
      const merged = [];
      for (const s of out) {
        const last = merged[merged.length - 1];
        const same = last && last.href === s.href && !!last.strong === !!s.strong && !!last.em === !!s.em;
        if (same) last.text += s.text;
        else merged.push({ ...s });
      }
      return merged.map((s) => ({ ...s, text: s.text })).filter((s) => s.text.trim() !== "");
    };
    const blocks = [];
    const seenImg = new Set();
    const seenText = new Set();
    const els = [...document.querySelectorAll("h1, h2, h3, h4, p, li, img, iframe")];
    for (const el of els) {
      if (skip(el)) continue;
      const tag = el.tagName.toLowerCase();
      if (tag === "img") {
        const src = el.currentSrc || el.src;
        if (!src || seenImg.has(src.split("=")[0])) continue;
        seenImg.add(src.split("=")[0]);
        blocks.push({ type: "image", src, alt: el.alt || "", width: el.naturalWidth, height: el.naturalHeight });
      } else if (tag === "iframe") {
        blocks.push({ type: "embed", src: el.src, title: el.title || "" });
      } else {
        // skip containers whose text is fully covered by a nested block (e.g. li > p)
        if (el.querySelector("p, h1, h2, h3, h4, li")) continue;
        const segs = segments(el);
        const text = segs.map((s) => s.text).join("").trim();
        if (!text) continue;
        const key = tag + "|" + text;
        if (seenText.has(key) && tag !== "li") continue;
        seenText.add(key);
        blocks.push({ type: tag === "li" ? "li" : tag, text, segments: segs });
      }
    }
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter(Boolean);
    return { title: document.title, blocks, links };
  });

  // save images for this page
  for (const b of data.blocks.filter((x) => x.type === "image")) {
    const base = baseOf(b.src);
    const got = captured.get(base);
    if (!got) {
      report.missingImages.push({ path, src: b.src.slice(0, 120) });
      continue;
    }
    if (!savedImages.has(base)) {
      const hash = createHash("sha1").update(base).digest("hex").slice(0, 16);
      const file = `images/${hash}.${extOf(got.type)}`;
      writeFileSync(OUT + file, got.buffer);
      savedImages.set(base, file);
    }
    b.file = savedImages.get(base);
    delete b.src;
  }

  writeFileSync(OUT + `pages/${slugOf(path)}.json`, JSON.stringify({ path, url: ORIGIN + path, title: data.title, blocks: data.blocks }, null, 2));
  report.pages.push({ path, blocks: data.blocks.length, images: data.blocks.filter((b) => b.type === "image").length });

  // follow internal links
  for (const href of data.links) {
    let p;
    try {
      const u = new URL(href, ORIGIN + path);
      if (u.origin !== ORIGIN) continue;
      p = u.pathname.replace(/\/$/, "") || "/";
    } catch { continue; }
    if (p.startsWith("/_") || /\.(pdf|jpg|png|zip)$/i.test(p)) continue;
    if (!seen.has(p) && !queue.includes(p)) queue.push(p);
  }
  console.log(`${path}  blocks=${data.blocks.length} images=${data.blocks.filter((b) => b.type === "image").length}`);
}

await browser.close();
report.summary = {
  pages: report.pages.length,
  images: savedImages.size,
  missingImages: report.missingImages.length,
  notFound: report.notFound.length,
};
writeFileSync(REPORTS + "extract.json", JSON.stringify(report, null, 2));
console.log("\nSUMMARY", report.summary);
