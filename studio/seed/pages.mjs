// Builds seed/pages.ndjson (About, Press mentions, Ways to Give) from seed/data/pages/*.json.
import {readFileSync, writeFileSync} from 'node:fs'
const load = (n) => JSON.parse(readFileSync(new URL(`./data/pages/${n}.json`, import.meta.url), 'utf8'))
let k = 0
const key = () => `k${++k}`
const block = (text, href) => {
  if (!href) return {_key: key(), _type: 'block', style: 'normal', markDefs: [], children: [{_key: key(), _type: 'span', text, marks: []}]}
  const m = key()
  return {_key: key(), _type: 'block', style: 'normal', markDefs: [{_key: m, _type: 'link', href}],
    children: [{_key: key(), _type: 'span', text, marks: [m]}]}
}
const rich = (heading, paras, link) => ({
  _key: key(), _type: 'richTextSection', heading,
  body: [...paras.map((p) => block(p)), ...(link ? [block(link.label, link.href)] : [])],
})
const cta = (heading, text, label, href) => ({_key: key(), _type: 'ctaSection', heading, text, cta: {_type: 'cta', label, href}})
const page = (slug, title, pageBuilder, desc) => ({
  _id: `page-${slug.replace('/', '-')}`, _type: 'page', title, slug: {_type: 'slug', current: slug},
  pageBuilder, seo: {_type: 'seo', title: `${title} | Indian American Artists Association`, description: desc},
})
const titleCase = (s) => s.replace(/\b(\w)(\w*)/g, (_, a, b) => a + b.toLowerCase())

const about = load('about'), press = load('press-mention'), give = load('ways-to-give')
const [intro, members, join] = about.sections
const docs = [
  page('about', 'About', [
    rich('About IAAA', intro.paragraphs),
    rich(members.heading, members.paragraphs),
    cta(join.heading, join.paragraphs[0], titleCase(about.ctas[0].label).replace('$50/Year', '$50 / year'), about.ctas[0].href),
  ], intro.paragraphs[0]),
  page('about/press-mention', 'Press mentions', [{
    _key: key(), _type: 'linkListSection', eyebrow: 'In the news', heading: 'Press mentions',
    links: press.items.map((i) => ({_key: key(), _type: 'cta', label: `${i.title} — ${i.publication}, ${i.date}`, href: i.href})),
  }], 'Coverage of IAAA and its members in the press.'),
  page('ways-to-give', 'Ways to give', [
    rich('Ways to give', []),
    ...give.sections.filter((s) => !['Membership Call-to-Action', 'Get Involved'].includes(s.heading))
      .map((s) => rich(s.heading, s.paragraphs, s.links[0])),
    cta('Your art has a story. Find the community that helps it travel further.',
      give.sections.find((s) => s.heading === 'Membership Call-to-Action').paragraphs[1],
      'Become a member · $50 / year', '/membership'),
  ], 'Support IAAA with an online donation, check, Zelle, donor-advised fund or corporate match.'),
]
writeFileSync(new URL('./pages.ndjson', import.meta.url), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`${docs.length} pages`)
