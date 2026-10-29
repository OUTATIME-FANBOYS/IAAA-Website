# IAAA website

The public site of the Indian American Artists Association: a Next.js app (`web/`) whose content lives entirely in Sanity (`../studio`).

```
iaaa/
  web/      Next.js 16 site (App Router, React 19, Tailwind 4)
  studio/   Sanity Studio: schemas and seed scripts for the content
```

## How content works

Nothing on a page is hard-coded. Every text, label, link, image and logo comes from Sanity; the only built-in fallback is the site title used in the browser tab if the CMS cannot be reached.

| What | Where in Sanity | Rendered by |
|---|---|---|
| Header, nav, logos, membership band, footer, social icons, UI labels | **Site settings** (one document) | `src/features/site-shell`, `src/app/layout.tsx` |
| Home, About, Membership, Ways to give, Organization, Members, Events pages | **Pages**, built from page-builder sections | `src/templates/PageBuilder.tsx` |
| Member profiles | **Members** | `src/features/members`, `/members/[slug]` |
| Event pages | **Events** | `src/features/events`, `/events/[slug]` |
| Org chart (officers, advisors, programs) | **Roles** and **Programs** | `src/features/org` |
| News cards on the home page | **News items** | `newsSection` |
| Instagram posts | Instagram Graph API (copy and button in the `instagramSection`) | `src/features/home` |

A page is a **Page** document whose slug is its URL (`home`, `about`, `membership`, `ways-to-give`, `about/organization`, `members`, `events`, ...). To add a page, create a Page in the Studio and add sections; no code change is needed.

### Page-builder sections

| Section | Use for |
|---|---|
| Page header (hero) | Eyebrow, title, intro, buttons, chips, optional image. Put it first on every page. |
| Card grid | Titled cards in 3 or 4 columns (benefits, what we do) |
| Statements | Two labelled statements side by side (mission, eligibility) |
| Heading + list | Heading and intro with a divided list (who can join) |
| Price card | Price, blurb, notes and a button (membership dues) |
| Giving channels | Numbered cards with a detail box, copy button, button or link |
| Founding members | Cards for every member marked as a founder |
| News grid, Instagram feed, Ways to get involved | Home page sections |
| Organization chart | Labels for the program model (people and programs come from Roles and Programs) |
| Member directory, Event list | Index pages |
| Text + links, Rich text, CTA | General content |

Every section has a **Background** option (beige, cherry blossom or pacific blue) so pages read as colour bands.

Interface labels used by the member and event templates (back links, "Add to calendar", empty-state text, group names) are in **Site settings > Interface labels**.

## Running locally

Requirements: Node 20+ and a Sanity login with access to the project (`npx sanity login`).

```bash
# website
cd web
npm install
npm run dev          # http://localhost:3000

# content studio (separate terminal)
cd studio
npm install
npm run dev          # http://localhost:3333
```

Published content appears on the site within about a minute, or immediately while the Studio is open in the same browser (live updates via `SanityLive`).

### Environment variables (`web/.env.local`)

See `web/.env.example`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project (`jh3pdn6m`) |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (`production`) |
| `INSTAGRAM_ACCESS_TOKEN` | Optional. Long-lived Instagram Graph API token for @artistsiaaa; without it the Instagram section shows its blurb and button only |

## Seeding content

`studio/seed/content.mjs` writes the starting content (settings, pages, roles, programs, events, logos) to the dataset with fixed document ids, so it can be re-run safely. **It replaces those documents**, so only run it on a fresh dataset or when you want to reset them:

```bash
cd studio
node seed/content.mjs
```

It authenticates with your `sanity login` token. Member and news documents are imported separately from `seed/members.ndjson` and `seed/home.ndjson` (`npx sanity dataset import`).

## Scripts (in `web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server (run `build` after every code change before `start`) |
| `npm test` | Unit tests (Vitest + Testing Library) |
| `npm run test:integration` | GROQ query tests against fixture data |
| `npm run test:a11y` | Accessibility tests (Playwright + axe) |
| `npm run lint` | ESLint, including the architecture boundary rules |

After changing a schema in `studio/`, regenerate the TypeScript types:

```bash
cd studio
npx sanity schema extract --force
npx sanity typegen generate     # writes ../web/sanity.types.ts
```

## Code layout

```
web/src/
  app/               Routes: layout, home, catch-all CMS pages, member and event detail
  templates/         Page builder: turns CMS sections into feature components
  features/          Business views and data access, one folder per area:
                     site-shell, home, about, membership, giving, members, events, org
  components/ui/     Global primitives (Button, Section, PageHero, FeatureHero, InfoCardGrid, ...)
  sanity/lib/        Client, queries, image helper, site-settings loader
```

Rules (enforced by ESLint): `components/ui` imports no features, CMS or templates; features never import other features or templates; `templates` compose features. See [ARCHITECTURE.md](./ARCHITECTURE.md). Colours, fonts and page designs are in [DESIGN_SPEC.md](./DESIGN_SPEC.md).

## Security

See [SECURITY.md](../SECURITY.md) for reporting and the full list of protections. Notes for developers:

- The Content-Security-Policy is built in `next.config.ts`. If you add a new third-party script, API or embed, add its host to the matching directive there or the browser will block it.
- Always render CMS or API links with `SmartLink` (never a raw `<a href>`), so unsafe schemes are dropped.
- `npm audit --omit=dev` should stay at 0 vulnerabilities; CI fails on critical ones.

## Deploying (Vercel)

1. Import the GitHub repo and set **Root Directory** to `web`.
2. Add the environment variables above.
3. In the Sanity project's API settings, add the Vercel domain to the CORS origins (leave "Allow credentials" off). Only needed for live content updates in the browser.
4. Deploy the Studio separately with `npx sanity deploy` (from `studio/`).

Pushes to `main` deploy to production; every branch gets a preview URL.
