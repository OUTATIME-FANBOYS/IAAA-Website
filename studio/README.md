# IAAA Content Studio

Sanity Studio for the IAAA website (project `jh3pdn6m`, dataset `production`). See the [website README](../web/README.md) for how the content maps to pages.

```bash
npm install
npx sanity login      # once
npm run dev           # http://localhost:3333
npm run deploy        # hosted Studio (sanity deploy)
```

## Content model

- **Site settings** (one document): header nav and logos, membership band (and the pages it is hidden on), footer, icon links, interface labels.
- **Page**: slug is the URL; content is a page builder (see `schemaTypes/objects`).
- **Member**, **Event**, **News item**, **Artwork**, **Role**, **Program**: structured documents used by the member, event, news and organization templates.
- **Member invite**: a draft-only document with a secret link that lets one person fill in the profile form. Open it in Studio to copy the link; it cannot be published. Submitted profiles arrive as unpublished Member drafts to review and publish.

## Seed scripts (`seed/`)

Run with your `sanity login` token: `node seed/<script>.mjs` (`leads.mjs` also accepts `DATASET=staging` to target another dataset and `DRY_RUN=1` to preview).

- `content.mjs`: settings, home and other pages, roles, programs, events and logos with fixed ids (`createOrReplace`, so it **replaces** those documents, including edits made in Studio). Run it on a fresh dataset only.
- `leads.mjs`: the Call for leads page (`membership/callforleads`).
- `members.mjs`: members from `seed/data/*.json`.
- `pages.mjs`: the About, Ways to give and Press mention pages from `seed/data/pages/`.
- `home-background.mjs`: uploads the home hero background image.
- `build.mjs`: older generator for the `*.ndjson` files below.
- `members.ndjson`, `home.ndjson`, `pages.ndjson`: older imports (`npx sanity dataset import <file> production`). `home.ndjson` and `pages.ndjson` predate the current design; prefer the scripts above.

## After changing a schema

```bash
npx sanity schema extract --force
npx sanity typegen generate     # updates ../web/sanity.types.ts
```
