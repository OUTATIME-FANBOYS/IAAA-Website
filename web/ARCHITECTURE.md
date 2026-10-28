# Architecture

Two rules decide where code goes.

1. **Global design primitives** live in `src/components/ui/` (atomic-style, flat). Buttons, links, headings, cards, layout wrappers. They know nothing about the CMS or any business concept.
2. **Everything with business meaning** is feature-based and lives in `src/features/<name>/`: views, data fetching, mappers, and tests for one area of the product.

## Content comes from Sanity

No page text, label, link, image or logo is hard-coded. Data helpers in each feature read Sanity and map CMS documents to plain props; components render only what they are given and hide anything missing. The one built-in fallback is the site title (`app/layout.tsx`) for when the CMS is unreachable. Every new template or component must therefore ship with matching Sanity fields (in `studio/schemaTypes`) for all of its text, labels and images, plus a query field and seed content.

## Layout

```
src/
  app/                     Routes. page.tsx and [...slug]/page.tsx render CMS pages via templates;
                           members/[slug] and events/[slug] render detail pages; layout.tsx builds the shell
  templates/               Page builder: maps each CMS section type to a feature component
                           (PageBuilder.tsx), fetches pages (PageView.tsx), shared types
  components/ui/           Global primitives (Button, Section, SectionHeading, SectionLabel, PageHero,
                           FeatureHero, EditorialCard, EditorialLink, InfoCardGrid, SmartLink, cn). Barrel: index.ts
  features/
    site-shell/            Header, footer, membership band, members menu, HideOnRoutes
    home/                  MemberNews, InstagramFeed, WaysToGetInvolved, instagram.ts (Graph API)
    about/                 QuotesSection, FoundersSection
    membership/            ChecklistSection, PricingSection
    giving/                ChannelsSection, CopyButton
    members/               MemberDirectory, MemberProfile, data.ts
    events/                EventHero, EventBody, EventFigure, EventCard, RelatedEvents, data.ts
    org/                   OrgChartSection, ProgramModel, data.ts (Roles + Programs)
      each feature:        index.ts (public API), data.ts (CMS access, where it has data), __tests__/
  sanity/lib/              CMS infrastructure: client, fetch, image, live, queries, settings (site settings loader), text
  test/setup.ts            Vitest setup
tests/                     Playwright (e2e, a11y) and integration tests (GROQ against fixtures)
```

## Dependency rules (enforced by ESLint)

```
app  ->  templates  ->  features  ->  components/ui
                           |
                           +------->  sanity/lib
```

- `components/ui` imports nothing from `features`, `templates`, `sanity`, or `app`.
- A feature never imports another feature, a template, or `app`. Combine features in `templates/` (page sections) or `app/` (e.g. `layout.tsx` passes founders from `members` into the `site-shell` header).
- `templates` never import `app`.
- Import a feature through its barrel (`@/features/members`), not its internal files. Inside a feature, use relative imports.
- Components take plain props. Mapping from CMS documents to props happens in a feature's `data.ts` or in `templates/PageBuilder.tsx`.

## Adding things

- **New page**: create a Page document in Sanity with a slug; the catch-all route renders it. No code needed unless it needs a new section type.
- **New section type** (e.g. a timeline): add the object schema in `studio/schemaTypes/objects`, register it in `index.ts` and in the `page` document's `pageBuilder`, add its fields to `SECTION_FIELDS` in `sanity/lib/queries.ts`, build a component in the owning feature, map it in `templates/PageBuilder.tsx`, then regenerate types (`npx sanity schema extract --force && npx sanity typegen generate`).
- **New feature area with its own data** (e.g. grants): create `features/grants/` with `data.ts`, components, `index.ts`, `__tests__/`, a schema and queries; add a detail route in `app/` if it needs one.
- **New primitive** (input, alert, modal): add to `components/ui/` and export from its `index.ts`. Add one only when it carries no business meaning. A component starts inside its feature and moves to `ui/` once a second feature needs it.
- **New CMS query**: add the GROQ to `sanity/lib/queries.ts`, add a case to `tests/integration`, then wrap/map it in the owning feature's `data.ts`. Components receive plain props, never raw CMS documents.
- **Design tokens** (colors, fonts, type scale, radius) are defined once in `app/globals.css` under `@theme`. Use token classes (`text-burgundy`, `bg-paper`, `font-serif`), never raw hex values.

## Tests

- Unit tests sit next to the code in `__tests__/` (Vitest + Testing Library): `npm test`.
- `tests/integration` (GROQ against a test dataset), `tests/e2e`, `tests/a11y` (Playwright): see `package.json` scripts.
