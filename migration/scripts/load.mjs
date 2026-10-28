/**
 * Loads ./transformed/docs.json into the target dataset (DATASET env, default "staging").
 * Idempotent: uploads each image once (Sanity de-duplicates identical files), writes documents with
 * createOrReplace and fixed ids, and patches existing documents. Safe to re-run.
 */
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { client, DATASET } from "./target.mjs";
import { ROOT } from "./lib.mjs";

const { docs, patches } = JSON.parse(readFileSync(ROOT + "transformed/docs.json", "utf8"));
const CACHE = ROOT + `transformed/assets-${DATASET}.json`;
const assets = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

const files = [...new Set(JSON.stringify({ docs, patches }).match(/"__file":"[^"]+"/g).map((s) => s.slice(10, -1)))];
console.log(`dataset=${DATASET}: ${files.length} images (${Object.keys(assets).length} already uploaded), ${docs.length} documents, ${patches.length} patches`);

async function upload(file) {
  if (assets[file]) return;
  const asset = await client.assets.upload("image", createReadStream(ROOT + "extracted/" + file), { filename: file.split("/").pop() });
  assets[file] = asset._id;
}
let done = 0;
const queue = [...files];
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const f = queue.shift();
      try {
        await upload(f);
      } catch (e) {
        console.error("upload failed", f, e.message);
      }
      if (++done % 25 === 0) {
        writeFileSync(CACHE, JSON.stringify(assets));
        console.log(`  uploaded ${done}/${files.length}`);
      }
    }
  }),
);
writeFileSync(CACHE, JSON.stringify(assets));
const failed = files.filter((f) => !assets[f]);
if (failed.length) {
  console.error(`${failed.length} images failed; aborting before writing documents`);
  process.exit(1);
}

/** Replace { __file, alt } placeholders with real image values. */
const resolve = (v) => {
  if (Array.isArray(v)) return v.map(resolve);
  if (v && typeof v === "object") {
    if ("__file" in v) return { _type: "imageWithAlt", asset: { _type: "reference", _ref: assets[v.__file] }, alt: v.alt };
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]));
  }
  return v;
};

// 1) documents (members first, then artworks, then the rest)
const order = { member: 0, artwork: 1, event: 2, page: 3 };
const resolved = docs.map(resolve).sort((a, b) => order[a._type] - order[b._type]);
for (let i = 0; i < resolved.length; i += 40) {
  const tx = client.transaction();
  for (const d of resolved.slice(i, i + 40)) tx.createOrReplace(d);
  await tx.commit();
}
console.log(`wrote ${resolved.length} documents`);

// 2) patches on existing documents
let patched = 0;
for (const p of patches) {
  const existing = await client.getDocument(p.id);
  if (!existing) {
    console.warn("skip patch, document missing:", p.id);
    continue;
  }
  const set = resolve(p.set);
  const fallbackBio = p.bioFallback && !(existing.bio?.length) ? resolve(p.bioFallback) : null;
  const fallbackDesc = p.descriptionFallback && !(existing.description?.length) ? resolve(p.descriptionFallback) : null;
  await client
    .patch(p.id)
    .set({ ...set, ...(fallbackBio ? { bio: fallbackBio } : {}), ...(fallbackDesc ? { description: fallbackDesc } : {}) })
    .commit();
  patched++;
}
console.log(`patched ${patched} documents`);
