/** Counts and integrity checks for the target dataset (DATASET env, default "staging"). */
import { client, DATASET } from "./target.mjs";

const q = async (query) => client.fetch(query);
const r = await q(`{
  "members": count(*[_type=="member"]),
  "membersWithPhoto": count(*[_type=="member" && defined(photo.asset)]),
  "membersWithBio": count(*[_type=="member" && count(bio) > 0]),
  "membersWithArtworks": count(*[_type=="member" && count(featuredArtworks) > 0]),
  "membersWithVideo": count(*[_type=="member" && defined(videoUrl)]),
  "artworks": count(*[_type=="artwork"]),
  "artworksWithImage": count(*[_type=="artwork" && defined(image.asset)]),
  "artworksWithoutTitle": count(*[_type=="artwork" && !defined(title)]),
  "artworksWithoutArtist": count(*[_type=="artwork" && !defined(artist.member) && !defined(artist.name)]),
  "events": count(*[_type=="event"]),
  "eventsWithHero": count(*[_type=="event" && defined(heroImage.asset)]),
  "eventsWithArtworks": count(*[_type=="event" && count(artworks) > 0]),
  "pages": count(*[_type=="page"]),
  "newsWithImage": count(*[_type=="newsItem" && defined(image.asset)]),
  "imageAssets": count(*[_type=="sanity.imageAsset"]),
  "danglingReferences": count(*[_type in ["member","event"]][count((featuredArtworks[]._ref + artworks[]._ref)[!defined(*[_id==^._ref][0]._id)]) > 0]),
  "imagesWithoutAlt": count(*[_type=="artwork" && defined(image.asset) && !defined(image.alt)])
}`);
console.log(`dataset=${DATASET}`);
console.table(r);
const bad = Object.entries(r).filter(([k, v]) => ["artworksWithoutArtist", "danglingReferences", "imagesWithoutAlt"].includes(k) && v > 0);
if (bad.length) { console.error("PROBLEMS:", bad); process.exit(1); }
