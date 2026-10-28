/**
 * Seeds all page, settings, role, program and event content into Sanity.
 * Uses createOrReplace with fixed ids, so it is safe to re-run.
 * Auth: the token from `sanity login` (~/.config/sanity/config.json).
 * Usage: node seed/content.mjs
 */
import {createClient} from '@sanity/client'
import {createReadStream, readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {randomBytes} from 'node:crypto'

const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: 'jh3pdn6m', dataset: 'production', apiVersion: '2026-10-02', token, useCdn: false})

const k = () => randomBytes(5).toString('hex')
const block = (text) => ({_type: 'block', _key: k(), style: 'normal', markDefs: [], children: [{_type: 'span', _key: k(), text, marks: []}]})
const cta = (label, href, style) => ({_type: 'cta', label, href, ...(style ? {style} : {})})
const slug = (current) => ({_type: 'slug', current})
const ref = (id) => ({_type: 'reference', _ref: id})
const strings = (arr) => arr
const section = (_type, fields) => ({_key: k(), _type, ...fields})

async function uploadImage(path, alt) {
  const asset = await client.assets.upload('image', createReadStream(path), {filename: path.split('/').pop()})
  return {_type: 'imageWithAlt', asset: {_type: 'reference', _ref: asset._id}, alt}
}

const logo = await uploadImage('../web/public/logo.png', 'Indian American Artists Association logo')
const logoLight = await uploadImage('../web/public/logo-light.png', 'Indian American Artists Association logo (light)')

const DONATE = 'https://app.donorly.ai/en/donate/iaaa?org_name=iaaa'
const TREASURER = 'treasurer@indianamericanartists.org'

const docs = []

// ---- Site settings
docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteTitle: 'Indian American Artists Association',
  description: 'A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.',
  logo,
  logoLight,
  navigation: [['About', '/about'], ['Events', '/events'], ['Membership', '/membership'], ['Ways to Give', '/ways-to-give']].map(
    ([label, href]) => ({_key: k(), _type: 'navItem', label, href}),
  ),
  membershipBand: {
    heading: 'Find the community that helps you grow.',
    body: 'Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.',
    buttonLabel: 'Become a member',
    price: '$50 / year',
    href: '/membership',
    hiddenOnPaths: ['/', '/membership'],
  },
  footerHeading: 'Indian American Artists Association',
  footerText: 'Empower South Asian artists. Build community. Create impact.',
  supportLink: cta('Support our community', '/ways-to-give'),
  socialLinks: [
    ['Join WhatsApp community', 'https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S', 'whatsapp'],
    ['Instagram', 'https://www.instagram.com/artistsiaaa/', 'instagram'],
    ['Join our mailing list', 'http://eepurl.com/iULW-Y', 'mail'],
    ['Donate', DONATE, 'donate'],
  ].map(([label, href, icon]) => ({_key: k(), _type: 'socialLink', label, href, icon})),
  footerLegal: 'IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education.',
  labels: {
    membersMenuLabel: 'Members',
    membersMenuAll: 'All members',
    membersMenuOrg: 'Org structure',
    membersMenuOrgHref: '/about/organization',
    membersMenuFounders: 'Founding members',
    memberBack: '← All members',
    memberNoBio: 'A biography has not been added yet.',
    memberFeaturedEyebrow: 'Featured work',
    memberFeaturedHeading: 'Selected artworks',
    memberNoWork: 'No featured work has been added yet.',
    memberAppearancesEyebrow: 'Appearances',
    memberAppearancesHeading: 'Also showing in',
    memberNoEvents: 'Not currently listed in any events.',
    memberBackToDirectory: 'Back to member directory',
    memberVideo: 'Watch the artist’s video',
    memberGroupLeadership: 'Leadership',
    memberGroupAdvisory: 'Advisory board',
    memberGroupMember: 'Members',
    eventDate: 'Date',
    eventVenue: 'Venue',
    eventAddress: 'Address',
    eventLocation: 'Location',
    eventAddToCalendar: 'Add to calendar',
    eventAllEvents: 'All events',
    eventArtworksHeading: 'Artworks',
    eventRelatedHeading: 'Related events',
  },
})

// ---- Roles and programs
const leadership = [
  ['President', 'Vision and external representation', 'sujata-tibrewala'],
  ['Treasurer', 'Fiscal oversight and budget', 'abhishek-nigam'],
  ['Secretary', 'Governance and records', 'ramya-thattai'],
  ['Board Strategist', 'Vision and strategic inputs', 'charmaine-hussain'],
]
leadership.forEach(([title, focus, member], i) =>
  docs.push({_id: `role-${member}`, _type: 'role', title, focus, group: 'leadership', order: i + 1, person: ref(`member-${member}`)}),
)
;['salma-arastu', 'usha-shukla', 'amita-bhakta', 'shailesh-joshi', 'biplab-chattopadhyay', 'geeta-dave'].forEach((member, i) =>
  docs.push({_id: `role-advisory-${member}`, _type: 'role', title: 'Advisory board', group: 'advisory', order: i + 1, person: ref(`member-${member}`)}),
)
const standing = [
  ['Membership & Community', 'Member experience, recruitment, retention and engagement.', 'Monthly retreats, meetups and online forum'],
  ['Communications & PR', 'Brand, storytelling, media relations and public outreach.', 'Press mentions, digital campaigns and catalogs'],
  ['Programs & Exhibitions', 'Exhibitions, showcases, curation, venues and artist support.', 'Bay Area gallery showcases and virtual salons'],
  ['Fundraising & Development', 'Grants, sponsorships, donor relationships and sustainability.', 'Institutional grants and 501(c)(3) endowments'],
]
standing.forEach(([name, description, example], i) =>
  docs.push({_id: `program-standing-${i + 1}`, _type: 'program', name, kind: 'standing', description, example, order: i + 1}),
)
;['Education & Mentorship', 'Events & Productions', 'Creative Projects', 'Digital & Technology'].forEach((name, i) =>
  docs.push({_id: `program-popup-${i + 1}`, _type: 'program', name, kind: 'popup', order: i + 1}),
)

// ---- Events
docs.push({
  _id: 'event-great-elephant-migration',
  _type: 'event',
  title: 'Great Elephant Migration',
  slug: slug('great-elephant-migration'),
  year: 2026,
  type: 'exhibition',
  typeLabel: 'Exhibition',
  location: 'Livermore, CA',
  venue: 'Bankhead Theater and Stockmen’s Park',
  dateLabel: 'October 10 – December 6, 2026',
  startDate: '2026-10-10',
  endDate: '2026-12-06',
  summary: 'Draped in Heritage: member artists create original works of art draped over the elephants at key events during the exhibition.',
  description: [
    block('IAAA’s Draped in Heritage program brings together member artists to create original works of art draped over the elephants at key events during the Great Elephant Migration exhibition in Livermore.'),
    block('We draw on Indian artistic traditions — kalamkari, block print, batik, embroidery — and modern techniques and materials — upcycled fabrics, 3D printing etc., and weave in themes of conservation and coexistence. Our work will reach thousands of visitors in person in Livermore — and hundreds of thousands more across the globe through extensive media coverage of the exhibition.'),
  ],
  highlight: {intro: 'In the words of one of our members:', title: 'Jumbo (Haiku) — By Majella Pinto', lines: ['Thriving pachyderms', 'Reclaim space, food and freedom', 'Declaring cease-fire.']},
})
docs.push({_id: 'event-2026-artist-retreat', _type: 'event', title: '2026 Artist’s Retreat', slug: slug('2026-artist-retreat'), year: 2026, type: 'retreat', typeLabel: 'Artist’s Retreat', location: 'Sausalito, CA'})
docs.push({_id: 'event-2025-artist-retreat', _type: 'event', title: '2025 Artist’s Retreat', slug: slug('2025-artist-retreat'), year: 2025, type: 'retreat', typeLabel: 'Artist’s Retreat', location: 'Florence, AL'})

// ---- Pages
const page = (id, title, path, pageBuilder, seoDescription) => ({
  _id: id,
  _type: 'page',
  title,
  slug: slug(path),
  seo: {_type: 'seo', title: `${title} | Indian American Artists Association`.slice(0, 60), ...(seoDescription ? {description: seoDescription} : {})},
  pageBuilder,
})

docs.push({
  _id: 'page-home',
  _type: 'page',
  title: 'Home',
  slug: slug('home'),
  seo: {_type: 'seo', title: 'Indian American Artists Association', description: 'A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.'},
  pageBuilder: [
    section('hero', {
      eyebrow: 'By artists. For artists. With community.',
      heading: 'Your art has a story. Let’s help it travel further.',
      subheading: 'Join a growing network of Indian-origin visual artists creating, exhibiting, and building community across the United States.',
      imageUrl: 'https://framerusercontent.com/images/yus7k8ig8KjhW0sSpjxWEiLcnA.jpg',
      imageAlt: 'Representative abstract painting; temporary artwork pending original image upload',
      cta: cta('Become a member', '/membership'),
    }),
    section('newsSection', {eyebrow: 'From our community', heading: 'Member news & creative milestones', tone: 'blossom', items: []}),
    section('instagramSection', {
      eyebrow: 'On Instagram',
      heading: 'Follow @artistsiaaa',
      blurb: 'See studio visits, exhibition openings, and member work as it happens.',
      buttonLabel: 'Follow on Instagram',
      profileUrl: 'https://www.instagram.com/artistsiaaa/',
      postCount: 6,
      altFallback: 'Post from @artistsiaaa on Instagram',
      tone: 'pacific',
    }),
    section('waysSection', {
      heading: 'Ways to get involved',
      tone: 'blossom',
      cards: [
        {_key: k(), _type: 'way', title: 'Become a member', body: 'Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.', button: cta('Join for $50 / year', '/membership', 'primary')},
        {_key: k(), _type: 'way', title: 'Donate', body: 'Your tax-deductible gift supports exhibitions, retreats, and arts education for South Asian artists.', button: cta('Give today', DONATE, 'secondary')},
        {_key: k(), _type: 'way', title: 'Join the community', body: 'Chat with fellow artists on WhatsApp and get calls for art and event news in our mailing list.', button: cta('Join WhatsApp', 'https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S', 'secondary')},
      ],
      footerLink: cta('Join our mailing list', 'http://eepurl.com/iULW-Y'),
    }),
  ],
})

docs.push(
  page('page-about', 'About', 'about', [
    section('hero', {
      eyebrow: 'About IAAA',
      heading: 'Empowering South Asian visual voices.',
      subheading: 'IAAA is a 501(c)(3) nonprofit that supports Indian-origin visual artists in the United States through exhibition access, grants and an enduring creative community.',
      cta: cta('Become a member', '/membership'),
      secondaryLink: cta('How we are organized', '/about/organization'),
    }),
    section('quotesSection', {
      tone: 'blossom',
      quotes: [
        {_key: k(), _type: 'quote', label: 'Our mission', text: 'The Indian American Artists Association (IAAA) is a 501(c)(3) entity whose purpose is to provide fund-raising and financial support for the arts programs, to promote and uplift Indian American artists, their art activities, and to raise community awareness of the Indian arts through art education.'},
        {_key: k(), _type: 'quote', label: 'Who can join', text: 'Membership to IAAA is open to any self-identified artists from the Indian subcontinent, who work in visual mediums to create 2D/3D art such as painting, sketching, sculpture, digital art, photography, video art or mixed media (or a combination), who wish to actively support the goals of IAAA in promoting arts and artists from the Indian subcontinent.'},
      ],
    }),
    section('featureGrid', {
      eyebrow: 'What we do',
      heading: 'How we uplift South Asian visual arts',
      columns: 4,
      tone: 'paper',
      features: [
        ['Financial support & grants', 'Fund-raising, production stipends and fiscal sponsorship that pay for series, gallery space and residencies.'],
        ['Promotion & visibility', 'Curated exhibitions in San Rafael, Danville and San Jose, festival booths and public art commissions.'],
        ['Arts education & workshops', 'Lectures, youth masterclasses and technique seminars that build public understanding of South Asian art.'],
        ['Community & retreats', 'Artist retreats in Sausalito and Florence, monthly critiques and a peer network.'],
      ].map(([title, description]) => ({_key: k(), _type: 'feature', title, description})),
    }),
    section('foundersSection', {
      eyebrow: 'Founding members',
      heading: 'The artists who started IAAA',
      cardCaption: 'Read bio',
      link: cta('Browse all artists', '/members'),
      tone: 'pacific',
    }),
  ], 'Empowering South Asian visual voices through exhibition access, grants and an enduring creative community.'),

  page('page-membership', 'Membership', 'membership', [
    section('hero', {
      eyebrow: 'Membership',
      heading: 'Join our community of Indian American artists.',
      subheading: 'Your art has a story. Find the community that helps it travel further. Join a growing network of Indian-origin visual artists creating, exhibiting and building community across the United States.',
      cta: cta('Become a member · $50 / year', DONATE),
      secondaryLink: cta('How IAAA is organized', '/about/organization'),
    }),
    section('featureGrid', {
      eyebrow: 'What you get',
      heading: 'Benefits of membership',
      columns: 3,
      tone: 'blossom',
      features: [
        ['Group exhibitions', 'Juried and curated shows each year in galleries and civic spaces, including San Rafael, Danville and San Jose First Friday.'],
        ['Artist retreats', 'Immersive in-person retreats for making, critique and community, such as Sausalito in 2026 and Florence, AL in 2025.'],
        ['Promotion', 'Member features on our website, press releases and @artistsiaaa on Instagram.'],
        ['Critique & collaboration', 'Virtual and in-person meetups with guest curators, workshops and peer critique circles.'],
        ['Grants & fiscal sponsorship', 'Nonprofit backing for grant applications, public art proposals and arts council sponsorships.'],
        ['Online directory', 'A dedicated bio and portfolio page in our public member directory.'],
      ].map(([title, description]) => ({_key: k(), _type: 'feature', title, description})),
    }),
    section('checklistSection', {
      eyebrow: 'Who can join',
      heading: 'An open, welcoming guild',
      intro: 'Whether you work in oil, clay, fiber or pixels, there is a place for your practice here.',
      tone: 'paper',
      items: [
        ['Self-identified artists from the Indian subcontinent', 'Open to artists living and working in the United States.'],
        ['Every visual medium', 'Painting, sketching, sculpture, digital art, photography, video art, mixed media, textile and fiber, printmaking and ceramics.'],
        ['Every career stage', 'Emerging, mid-career and established artists are all welcome.'],
        ['Support for the mission', 'Members actively support IAAA’s goal of promoting arts and artists from the Indian subcontinent.'],
      ].map(([title, description]) => ({_key: k(), _type: 'item', title, description})),
    }),
    section('pricingSection', {
      label: 'Annual membership',
      title: 'Artist membership',
      price: '$50',
      priceUnit: '/ year',
      body: 'IAAA is an artist-run nonprofit. Your dues go toward lowering exhibition costs, reserving retreat spaces and hosting public art education.',
      notesHeading: 'Good to know',
      notes: ['Dues are tax-deductible as allowed by law; IAAA is a 501(c)(3).', 'Employer gift-matching may double your impact.'],
      cta: cta('Become a member · $50 / year', DONATE),
      tone: 'pacific',
    }),
  ], 'Join a growing network of Indian-origin visual artists creating, exhibiting and building community across the United States.'),

  page('page-ways-to-give', 'Ways to give', 'ways-to-give', [
    section('hero', {
      eyebrow: 'Support South Asian artists & culture',
      heading: 'Ways to give',
      subheading: 'Every gift nurtures an artist’s voice, funds regional exhibitions and keeps our creative heritage thriving across North America. IAAA is a recognized 501(c)(3) organization.',
      align: 'center',
      chips: ['501(c)(3) nonprofit', 'Tax-deductible to the extent allowed by law', 'Employer match eligible'],
    }),
    section('channelsSection', {
      eyebrow: 'Giving channels',
      heading: 'Choose how you would like to contribute',
      tone: 'blossom',
      channels: [
        {_key: k(), _type: 'channel', title: 'Online donation', body: 'Give securely online with a credit card, debit card or bank account, as a one-time gift or on a recurring schedule.', button: cta('Donate online', DONATE, 'primary')},
        {_key: k(), _type: 'channel', title: 'Memorials & tributes', body: 'IAAA is honored to accept gifts celebrating special occasions, or given in loving memory of a community member.',
          panel: {heading: 'Dedication guidelines', lines: ['Memorial gift: In memory of (name), and the address of the family to receive notice.', 'Tribute gift: In honor of (name) on (occasion).'], footnote: 'Email details to', footnoteLink: cta(TREASURER, `mailto:${TREASURER}`)}},
        {_key: k(), _type: 'channel', title: 'Donate by Zelle', body: 'Make a fast, direct transfer from your banking app or web portal.',
          panel: {heading: 'Registered Zelle recipient email', copyValue: 'artists.iaaa@gmail.com', copyLabel: 'Copy email', copiedLabel: 'Copied', monospace: true},
          note: 'Please include your full name and email in the Zelle memo so we can send a tax receipt.'},
        {_key: k(), _type: 'channel', title: 'Corporate matching', body: 'Many companies match charitable gifts made by their employees. Check with your employer’s HR or CSR team (Benevity, CyberGrants, Bright Funds and others) to multiply your support.', button: cta('Check company match & donate', DONATE, 'secondary')},
        {_key: k(), _type: 'channel', title: 'Donor advised fund (DAF)', body: 'Recommend a grant to IAAA through your DAF provider, such as Fidelity Charitable, Schwab Charitable or Vanguard Charitable.', link: cta('Email us for DAF details', `mailto:${TREASURER}?subject=DAF%20grant%20to%20IAAA`)},
        {_key: k(), _type: 'channel', title: 'Donate by check', body: 'Make your check payable to “Indian American Artists Association” and mail it to:',
          panel: {lines: ['Indian American Artists Association', '1461 Edsel Dr', 'Milpitas, CA 95035'], monospace: true},
          note: 'A written receipt for tax documentation will be mailed upon receipt.'},
      ],
    }),
  ], 'Support South Asian artists and culture with a tax-deductible gift to the Indian American Artists Association.'),

  page('page-organization', 'Organization structure', 'about/organization', [
    section('hero', {
      eyebrow: 'About IAAA',
      heading: 'By artists. For artists. With community.',
      subheading: 'IAAA is run by a small board of working artists, guided by an advisory board, and carried out through standing and pop-up programs. Our mission: Empower South Asian artists. Build community. Create impact.',
    }),
    section('orgChartSection', {
      eyebrow: 'Organizational ecosystem',
      heading: 'Program model',
      tagline: 'By artists. For artists. With community.',
      mission: 'Empower South Asian artists. Build community. Create impact.',
      missionLabel: 'Our mission',
      coreLabel: 'The core',
      coreNote: 'Minimum viable board · legal & fiscal guardians',
      advisoryLabel: 'Advisory board',
      advisoryNote: 'Non-voting & community counsel',
      standingLabel: 'Standing programs',
      standingNote: 'Essential for long-term viability',
      popupEyebrow: 'Flexible programs',
      popupHeading: 'Pop-up initiatives',
      tone: 'pacific',
      popupTone: 'blossom',
    }),
  ], 'How the Indian American Artists Association is led and organized.'),

  page('page-members', 'Members', 'members', [
    section('hero', {
      eyebrow: 'Our community',
      heading: 'Member directory',
      subheading: 'Browse the artists of IAAA by leadership, advisory board, and member.',
    }),
    section('memberDirectorySection', {
      allLabel: 'All',
      countLabel: 'Showing {count} members',
      emptyText: 'No members match this filter.',
      foundersEyebrow: 'Where it began',
      foundersHeading: 'Founding members',
      tone: 'paper',
      foundersTone: 'blossom',
    }),
  ], 'Meet the Indian-origin visual artists who make up the Indian American Artists Association.'),

  page('page-events', 'Events', 'events', [
    section('hero', {
      eyebrow: 'Creating connections',
      heading: 'Events',
      subheading: 'Our artist retreats and exhibitions foster stronger bonds within the organization and create meaningful impact in the communities our members call home.',
    }),
    section('eventListSection', {emptyText: 'No events are listed right now. Please check back soon.', tone: 'blossom'}),
  ], 'Artist retreats, exhibitions and gatherings of the Indian American Artists Association.'),
)

const tx = client.transaction()
for (const d of docs) tx.createOrReplace(d)
// Superseded draft of the home page (identical to the published content before this seed).
tx.delete('drafts.page-home')
const res = await tx.commit()
console.log('committed', res.results.length, 'operations;', docs.length, 'documents')
