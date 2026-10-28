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

## Seed scripts (`seed/`)

- `content.mjs`: writes settings, pages, roles, programs, events and logos with fixed ids (`createOrReplace`, so it replaces those documents). Uses your `sanity login` token: `node seed/content.mjs`.
- `members.ndjson`, `home.ndjson`, `pages.ndjson`: older imports (`npx sanity dataset import <file> production`).

## After changing a schema

```bash
npx sanity schema extract --force
npx sanity typegen generate     # updates ../web/sanity.types.ts
```
