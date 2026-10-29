/** Reads the member and news ids from the target dataset so the transform can link to them. */
import { writeFileSync } from "node:fs";
import { client, DATASET } from "./target.mjs";
import { ROOT } from "./lib.mjs";

const members = await client.fetch(`*[_type=="member" && defined(slug.current)]{_id, name, "slug": slug.current}`);
const news = await client.fetch(`*[_type=="newsItem"]{_id, title}`);
writeFileSync(ROOT + "reports/members.json", JSON.stringify(members, null, 2));
writeFileSync(ROOT + "reports/news.json", JSON.stringify(news, null, 2));
console.log(`dataset ${DATASET}: ${members.length} members, ${news.length} news items`);
