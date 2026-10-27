// Builds seed/members.ndjson from seed/data/<slug>.json (scraped from the old site).
import {readdirSync, readFileSync, writeFileSync} from 'node:fs'
const dir = new URL('./data/', import.meta.url)
const FOUNDERS = ['sujata-tibrewala', 'abhishek-nigam', 'biplab-chattopadhyay']
const LEADERSHIP = ['sujata-tibrewala', 'abhishek-nigam', 'ramya-thattai', 'charmaine-hussain']
const ADVISORY = ['salma-arastu', 'usha-shukla', 'amita-bhakta', 'shailesh-joshi', 'geeta-dave', 'biplab-chattopadhyay']
const para = (text, k) => ({_key: k, _type: 'block', style: 'normal', markDefs: [], children: [{_key: `${k}s`, _type: 'span', text, marks: []}]})
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== ''))
const byId = new Map()
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const m = JSON.parse(readFileSync(new URL(f, dir), 'utf8'))
  // the old sitemap has swati-rastogi and swati-rastogi_1; the _1 page holds the real bio, so it wins
  if (m.slug.endsWith('_1')) m.slug = m.slug.slice(0, -2)
  if (m.error || !m.name) { console.warn('skipped', m.slug, m.error ?? ''); continue }
  const L = m.links ?? {}
  byId.set(m.slug, clean({
    _id: `member-${m.slug}`, _type: 'member', name: m.name,
    slug: {_type: 'slug', current: m.slug},
    roleTitle: m.role,
    group: LEADERSHIP.includes(m.slug) ? 'leadership' : ADVISORY.includes(m.slug) ? 'advisory' : 'member',
    isFounder: FOUNDERS.includes(m.slug),
    founderOrder: FOUNDERS.includes(m.slug) ? FOUNDERS.indexOf(m.slug) + 1 : undefined,
    location: m.location,
    tagline: m.medium,
    // portraits: the old site's Google Sites image URLs return 403, so photos are uploaded in the Studio instead
    bio: (m.bio ?? []).map((t, i) => para(t, `p${i + 1}`)),
    links: clean({website: L.website, instagram: L.instagram, facebook: L.facebook, youtube: L.youtube, blog: L.blog}),
  }))
}
const docs = [...byId.values()]
writeFileSync(new URL('./members.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`${docs.length} members`)
