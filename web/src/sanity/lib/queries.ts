import { defineQuery } from "next-sanity";

const IMAGE = `{ asset, hotspot, crop, alt }`;
const CTA = `{ label, href, style }`;
const NEWS_ITEM = `{ _id, title, url, source, date, image${IMAGE} }`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteTitle, description,
    logo${IMAGE}, logoLight${IMAGE},
    navigation[]{ _key, label, href },
    membershipBand{ heading, body, buttonLabel, price, href, hiddenOnPaths },
    footerHeading, footerText,
    supportLink${CTA},
    socialLinks[]{ _key, label, href, icon },
    footerLegal,
    labels
  }
`);

const SECTION_FIELDS = `
  _key, _type,
  _type == "hero" => {
    eyebrow, heading, subheading, imageUrl, imageAlt, align, chips, backgroundOpacity,
    image${IMAGE}, background${IMAGE},
    cta${CTA}, secondaryLink${CTA}
  },
  _type == "newsSection" => {
    eyebrow, heading, tone,
    "items": select(
      count(items) > 0 => items[]->${NEWS_ITEM},
      *[_type == "newsItem"] | order(coalesce(order, 9999) asc, date desc)${NEWS_ITEM}
    )
  },
  _type == "instagramSection" => { eyebrow, heading, blurb, buttonLabel, profileUrl, postCount, altFallback, tone },
  _type == "waysSection" => {
    heading, tone, footerLink${CTA},
    cards[]{ _key, title, body, button${CTA} }
  },
  _type == "quotesSection" => { tone, quotes[]{ _key, label, text } },
  _type == "featureGrid" => {
    eyebrow, heading, intro, columns, tone,
    features[]{ _key, title, description, tag }
  },
  _type == "foundersSection" => { eyebrow, heading, cardCaption, link${CTA}, tone },
  _type == "checklistSection" => { eyebrow, heading, intro, tone, items[]{ _key, title, description } },
  _type == "pricingSection" => { label, title, price, priceUnit, body, notesHeading, notes, cta${CTA}, tone },
  _type == "channelsSection" => {
    eyebrow, heading, tone,
    channels[]{
      _key, title, body, note,
      panel{ heading, lines, monospace, copyValue, copyLabel, copiedLabel, footnote, footnoteLink${CTA} },
      button${CTA}, link${CTA}
    }
  },
  _type == "orgChartSection" => {
    eyebrow, heading, tagline, mission, missionLabel, coreLabel, coreNote,
    advisoryLabel, advisoryNote, standingLabel, standingNote,
    popupEyebrow, popupHeading, tone, popupTone
  },
  _type == "memberDirectorySection" => {
    allLabel, countLabel, emptyText, foundersEyebrow, foundersHeading, tone, foundersTone
  },
  _type == "eventListSection" => { eyebrow, heading, emptyText, tone },
  _type == "linkListSection" => { eyebrow, heading, body, tone, links[]{ _key, label, href, style } },
  _type == "richTextSection" => { eyebrow, heading, tone, body },
  _type == "ctaSection" => { heading, text, tone, cta${CTA} }
`;

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, slug, seo,
    pageBuilder[]{ ${SECTION_FIELDS} }
  }
`);

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current }
`);

const EVENT_FIELDS = `
  _id, title, "slug": slug.current, year, "type": coalesce(typeLabel, type), summary, location,
  dateLabel, startDate, endDate, venue, address,
  sessions[]{ _key, label, date, time },
  heroImage${IMAGE}
`;

export const EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(coalesce(startDate, string(year)) desc, title asc){ ${EVENT_FIELDS} }
`);

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    ${EVENT_FIELDS},
    description,
    artworks[]->{
      _id, title, medium, dimensions, description,
      image${IMAGE},
      "artistName": coalesce(artist.member->name, artist.name),
      "artistSlug": artist.member->slug.current
    },
    figures[]{ _key, caption, credit, image${IMAGE} },
    highlight{ intro, title, lines },
    recapPhotos[]${IMAGE}
  }
`);

const MEMBER_FIELDS = `
  _id, name, "slug": slug.current, roleTitle, group, isFounder, founderOrder, location, tagline,
  photo${IMAGE}
`;

export const MEMBERS_QUERY = defineQuery(`
  *[_type == "member" && defined(slug.current)] | order(name asc){ ${MEMBER_FIELDS} }
`);

export const MEMBER_QUERY = defineQuery(`
  *[_type == "member" && slug.current == $slug][0]{
    ${MEMBER_FIELDS}, bio, links, videoUrl,
    featuredArtworks[]->{ _id, title, medium, dimensions, description, year, image${IMAGE} },
    "events": events[]->{ title, "slug": slug.current }
  }
`);

/** Founding members, for the header menu and founders sections. */
export const FOUNDERS_QUERY = defineQuery(`
  *[_type == "member" && isFounder == true && defined(slug.current)]
    | order(coalesce(founderOrder, 9999) asc, name asc){ _id, name, "slug": slug.current }
`);

export const ROLES_QUERY = defineQuery(`
  *[_type == "role"] | order(coalesce(order, 9999) asc){
    _id, title, focus, group,
    "person": person->{ name, "slug": slug.current }
  }
`);

export const PROGRAMS_QUERY = defineQuery(`
  *[_type == "program"] | order(coalesce(order, 9999) asc, name asc){
    _id, name, kind, description, example
  }
`);
