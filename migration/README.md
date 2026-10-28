# Legacy site migration

One-off, repeatable scripts that copy the old Google Sites site (indianamericanartists.org) into Sanity. The old site only serves images to a real browser, so extraction uses headless Chromium (Playwright).

```bash
cd migration
npm install
node scripts/extract.mjs                       # crawl the old site -> extracted/ (pages as JSON, images as files)
DATASET=staging node scripts/snapshot-target.mjs  # read member and news ids from the target dataset
node scripts/transform.mjs                     # -> transformed/docs.json + reports/transform.json
DATASET=staging node scripts/load.mjs          # upload images, write documents, patch existing ones
DATASET=staging node scripts/validate.mjs      # counts, broken references, missing alt text
```

- `extracted/` and `transformed/` are git-ignored (hundreds of MB of images). Re-run `extract` to rebuild them.
- Document ids are deterministic (`artwork-<member>-NN`, `event-<slug>`, ...) and writes use `createOrReplace`/patches, so re-running `load` converges.
- Auth uses your `npx sanity login` token. Always load into a scratch dataset (`staging`, private) first, review it, then run with `DATASET=production`.
- To review a dataset on the site locally: `NEXT_PUBLIC_SANITY_DATASET=staging SANITY_API_READ_TOKEN=<token> npm run dev` in `web/` (the token is only needed for private datasets).

## What gets imported

| Source | Target |
|---|---|
| Member pages (29) | member photo (first image), video link, bio if empty, artworks (image, title, medium, dimensions, description) linked as featured work; a missing member (Hetal Anjaria) is created |
| Event pages (9) | events (new ones created, existing ones get cover image, gallery, artworks); exhibit pages with "Title - Artist" captions become artworks linked to members or named guests |
| Great Elephant Migration sub-pages (27) | one artwork each (artist, medium, dimensions, description), linked to the event. Prices and artist statements are not imported |
| Membership pages | `membership/why-be-a-member` and `membership/callforleads` pages (text only) |
| Home news captions | images attached to matching news items |

Skipped (see `reports/transform.json`): the Org Structure embed, the community photo page, news images with no matching news item.
