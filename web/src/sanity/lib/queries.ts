import { defineQuery } from "next-sanity";

const IMAGE = `{ asset, hotspot, crop, alt }`;

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteTitle, description,
    logo${IMAGE},
    navigation[]{ _key, label, href },
    membershipBand{ heading, body, buttonLabel, price, href },
    footerHeading, footerText,
    supportLink{ label, href },
    footerLinks[]{ _key, label, href },
    footerLegal, whatsappUrl, mailingListUrl, instagramUrl, donateUrl
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, slug, body,
    seo,
    pageBuilder[]{
      _key, _type,
      _type == "hero" => {
        eyebrow, heading, subheading, imageUrl, imageAlt,
        image${IMAGE},
        cta{ label, href }
      },
      _type == "newsSection" => {
        eyebrow, heading,
        "items": select(
          count(items) > 0 => items[]->{ _id, title, url, source, date, image${IMAGE} },
          *[_type == "newsItem"] | order(coalesce(order, 9999) asc, date desc){ _id, title, url, source, date, image${IMAGE} }
        )
      },
      _type == "linkListSection" => {
        eyebrow, heading, body, links[]{ _key, label, href }
      },
      _type == "richTextSection" => { heading, body },
      _type == "featureGrid" => { heading, features[]{ _key, title, description } },
      _type == "ctaSection" => { heading, text, cta{ label, href } }
    }
  }
`);

/** Home page is the page document with slug "home". */
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == "home"][0]{
    _id, title, seo,
    pageBuilder[]{
      _key, _type,
      _type == "hero" => {
        eyebrow, heading, subheading, imageUrl, imageAlt,
        image${IMAGE},
        cta{ label, href }
      },
      _type == "newsSection" => {
        eyebrow, heading,
        "items": select(
          count(items) > 0 => items[]->{ _id, title, url, source, date, image${IMAGE} },
          *[_type == "newsItem"] | order(coalesce(order, 9999) asc, date desc){ _id, title, url, source, date, image${IMAGE} }
        )
      },
      _type == "linkListSection" => {
        eyebrow, heading, body, links[]{ _key, label, href }
      }
    }
  }
`);

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current }
`);

export const NEWS_ITEMS_QUERY = defineQuery(`
  *[_type == "newsItem"] | order(coalesce(order, 9999) asc, date desc){
    _id, title, url, source, date, image${IMAGE}
  }
`);

const EVENT_CARD = `
  _id, title, "slug": slug.current, year, type, venue,
  sessions[]{ _key, label, date, time },
  heroImage${IMAGE}
`;

export const EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(year desc, title asc){ ${EVENT_CARD} }
`);

export const EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)]{ "slug": slug.current }
`);

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    ${EVENT_CARD}, address, description, videoUrl,
    recapPhotos[]{ _key, asset, hotspot, crop, alt },
    artworks[]->{
      _id, title, series, medium, year,
      image${IMAGE},
      "artistName": coalesce(artist.member->name, artist.name),
      "artistSlug": artist.member->slug.current
    }
  }
`);

const MEMBER_CARD = `
  _id, name, "slug": slug.current, roleTitle, group, isFounder, founderOrder, location, tagline, photo${IMAGE}
`;

export const MEMBERS_QUERY = defineQuery(`
  *[_type == "member" && defined(slug.current)] | order(name asc){ ${MEMBER_CARD} }
`);

/** Founding members, for the header menu and the Members page subsection. */
export const FOUNDERS_QUERY = defineQuery(`
  *[_type == "member" && isFounder == true && defined(slug.current)]
    | order(coalesce(founderOrder, 9999) asc, name asc){ _id, name, "slug": slug.current }
`);

export const MEMBER_SLUGS_QUERY = defineQuery(`
  *[_type == "member" && defined(slug.current)]{ "slug": slug.current }
`);

export const MEMBER_QUERY = defineQuery(`
  *[_type == "member" && slug.current == $slug][0]{
    ${MEMBER_CARD}, bio, links,
    featuredArtworks[]->{ _id, title, series, medium, year, image${IMAGE} },
    "events": *[_type == "event" && ^._id in artworks[]->artist.member._ref]
      | order(year desc){ _id, title, "slug": slug.current, year }
  }
`);

export const ORG_STRUCTURE_QUERY = defineQuery(`{
  "roles": *[_type == "role"]{
    _id, title, group,
    person->{ _id, name, "slug": slug.current, photo${IMAGE} }
  },
  "programs": *[_type == "program"] | order(name asc){
    _id, name, kind, description, icon${IMAGE}
  }
}`);
