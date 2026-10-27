# Architecture

Two rules decide where code goes.

1. **Global design primitives** live in `src/components/ui/` (atomic-style, flat). Buttons, links, headings, cards, layout wrappers. They know nothing about the CMS or any business concept.
2. **Everything with business meaning** is feature-based and lives in `src/features/<name>/`: views, data fetching, mappers, and tests for one area of the product.

## Layout

```
src/
  app/                     Routes only. Fetch, then compose feature components. No styling logic.
  components/ui/           Global primitives (Button, Section, SectionHeading, SectionLabel,
                           EditorialCard, EditorialLink, InfoCardGrid, SmartLink, cn). Barrel: index.ts
  features/
    site-shell/            Header, footer, membership band, members menu, HideOnRoutes
    home/                  Hero, MemberNews, ArtistRetreats, InstagramFeed, WaysToGetInvolved,
                           instagram.ts (Graph API)
    members/               MemberDirectory, MemberProfile, data.ts (queries + mapping)
    events/                EventCard, data.ts
    org/                   ProgramModel (org chart), data.ts (leadership, advisory, programs)
    about/                 MissionCharter, data.ts (verbatim charter text, what-we-do)
    giving/                GivingChannels, CopyButton, data.ts (donation channels, contact details)
    membership/            EligibilityList, DuesCard, data.ts (benefits, eligibility, dues, join URL)
      each feature:        index.ts (public API), data.ts (CMS access), __tests__/
  sanity/lib/              CMS infrastructure: client, fetch, image, live, queries
  test/setup.ts            Vitest setup
tests/                     Playwright (e2e, a11y) and integration tests
```

## Dependency rules (enforced by ESLint)

```
app  ->  features  ->  components/ui
            |
            +------->  sanity/lib
```

- `components/ui` imports nothing from `features`, `sanity`, or `app`.
- A feature never imports another feature or `app`. If two features need to be combined, `app/` does it (e.g. `layout.tsx` passes founders from `members` into the `site-shell` header).
- Import a feature through its barrel (`@/features/members`), not its internal files. Inside a feature, use relative imports.
- Pages stay thin: `app/**/page.tsx` fetches via a feature's `data.ts`, then renders feature components.

## Adding things

- **New page area** (e.g. grants): create `features/grants/` with `data.ts`, components, `index.ts`, `__tests__/`; add the route in `app/grants/`.
- **New primitive** (input, alert, modal): add to `components/ui/` and export from its `index.ts`. Add one only when it carries no business meaning. A component starts inside its feature and moves to `ui/` once a second feature needs it.
- **New CMS query**: add the GROQ to `sanity/lib/queries.ts`, then wrap/map it in the owning feature's `data.ts`. Components receive plain props, never raw CMS documents.
- **Design tokens** (colors, fonts, type scale, radius) are defined once in `app/globals.css` under `@theme`. Use token classes (`text-burgundy`, `bg-paper`, `font-serif`), never raw hex values.

## Tests

- Unit tests sit next to the code in `__tests__/` (Vitest + Testing Library): `npm test`.
- `tests/integration` (GROQ against a test dataset), `tests/e2e`, `tests/a11y` (Playwright): see `package.json` scripts.
