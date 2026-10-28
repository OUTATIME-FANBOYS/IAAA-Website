import {artwork} from './documents/artwork'
import {event} from './documents/event'
import {member} from './documents/member'
import {newsItem} from './documents/newsItem'
import {page} from './documents/page'
import {program} from './documents/program'
import {role} from './documents/role'
import {siteSettings} from './documents/siteSettings'
import {cta} from './objects/cta'
import {ctaSection} from './objects/ctaSection'
import {featureGrid} from './objects/featureGrid'
import {hero} from './objects/hero'
import {imageWithAlt} from './objects/imageWithAlt'
import {linkListSection} from './objects/linkListSection'
import {newsSection} from './objects/newsSection'
import {richTextSection} from './objects/richTextSection'
import {seo} from './objects/seo'
import {eventSession} from './objects/sessions'

import {checklistSection} from './objects/checklistSection'
import {channelsSection} from './objects/channelsSection'
import {eventListSection, memberDirectorySection} from './objects/directorySections'
import {foundersSection} from './objects/foundersSection'
import {instagramSection} from './objects/instagramSection'
import {orgChartSection} from './objects/orgChartSection'
import {pricingSection} from './objects/pricingSection'
import {quotesSection} from './objects/quotesSection'
import {waysSection} from './objects/waysSection'

export const schemaTypes = [
  page,
  siteSettings,
  member,
  artwork,
  event,
  newsItem,
  role,
  program,
  seo,
  cta,
  imageWithAlt,
  eventSession,
  hero,
  newsSection,
  linkListSection,
  richTextSection,
  featureGrid,
  ctaSection,
  quotesSection,
  checklistSection,
  pricingSection,
  channelsSection,
  foundersSection,
  instagramSection,
  waysSection,
  orgChartSection,
  memberDirectorySection,
  eventListSection,
]
