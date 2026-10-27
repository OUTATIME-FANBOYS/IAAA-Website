import {writeFileSync} from 'node:fs'
const L = (label, href, k) => ({_key: k, _type: 'cta', label, href})
const news = [
  ['Geeta Dave’s interview with NPN', 'https://npnweb.org/an-interview-with-geeta-dave/'],
  ['Pragati Sharma at Mohr Gallery', 'https://www.pragatisharma.com/'],
  ['Pragati Sharma at Richmond Art Center', 'https://www.pragatisharma.com/'],
  ['Salma Arastu in the spotlight', 'https://www.indianamericanartists.org/member-bios/members/salma-arastu'],
  ['East West: My Journey — Nanda Patel', 'https://galleryat808.com/portfolio/exhibition-pieces/'],
  ['Usha Shukla at Fox Chase Cancer Center', 'https://www.indianamericanartists.org/member-bios/members/usha-shukla'],
  ['The healing power of art — Sujata Tibrewala', 'https://www.healing-power-of-art.org/world-changer-sujata-tibrewala-artist-and-founder-of-iaaa/'],
  ['Geeta Dave: Replenish 2026 resident', 'https://www.indianamericanartists.org/member-bios/members/geeta-dave'],
]
const docs = news.map(([title, url], i) => ({_id: `newsItem-home-${i + 1}`, _type: 'newsItem', title, url, order: i + 1}))
const site = 'https://www.indianamericanartists.org'
docs.push({
  _id: 'page-home', _type: 'page', title: 'Home', slug: {_type: 'slug', current: 'home'},
  seo: {_type: 'seo', title: 'Indian American Artists Association',
    description: 'A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.'},
  pageBuilder: [
    {_key: 'hero', _type: 'hero', eyebrow: 'By artists. For artists. With community.',
      heading: 'Your art has a story. Let’s help it travel further.',
      subheading: 'Join a growing network of Indian-origin visual artists creating, exhibiting, and building community across the United States.',
      imageUrl: 'https://framerusercontent.com/images/yus7k8ig8KjhW0sSpjxWEiLcnA.jpg',
      imageAlt: 'Representative abstract painting; temporary artwork pending original image upload',
      cta: {_type: 'cta', label: 'Become a member', href: `${site}/membership`}},
    {_key: 'news', _type: 'newsSection', eyebrow: 'From our community', heading: 'Member news & creative milestones', items: []},
    {_key: 'retreats', _type: 'linkListSection', eyebrow: 'Creating connections',
      heading: 'More than art. A sense of belonging.',
      body: 'Our artist retreats foster stronger bonds within the organization and create meaningful impact in the communities our members call home.',
      links: [L('2026 Artist’s Retreat · Sausalito, CA', `${site}/events/2026-artist-retreat`, 'r26'),
              L('2025 Artist’s Retreat · Florence, AL', `${site}/events/2025-artist-retreat`, 'r25')]},
  ],
})
docs.push({
  _id: 'siteSettings', _type: 'siteSettings', siteTitle: 'Indian American Artists Association',
  description: 'A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.',
  navigation: [['About','/about'],['Events','/events'],['Membership','/membership'],['Ways to Give','/ways-to-give']]
    .map(([label, p], i) => ({_key: `n${i}`, _type: 'navItem', label, href: `${site}${p}`})),
  membershipBand: {heading: 'Find the community that helps you grow.',
    body: 'Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.',
    buttonLabel: 'Become a member', price: '$50 / year', href: '/membership'},
  footerHeading: 'Indian American Artists Association',
  footerText: 'Empower South Asian artists. Build community. Create impact.',
  supportLink: {_type: 'cta', label: 'Support our community', href: '/ways-to-give'},
  footerLinks: [L('Join WhatsApp community','https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S','f1'),
    L('Join our mailing list','http://eepurl.com/iULW-Y','f2'),
    L('Instagram','https://www.instagram.com/artistsiaaa/','f3'),
    L('Donate','https://app.donorly.ai/en/donate/iaaa?org_name=iaaa','f4')],
  footerLegal: 'IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education.',
})
writeFileSync('seed/home.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(docs.length, 'docs')
