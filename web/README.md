# IAAA website (web)

Next.js app for the Indian American Artists Association. Content comes from Sanity (`../studio`).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run lint
npm run build
```

Environment variables go in `.env.local` (not committed): Sanity project/dataset, and optionally
`INSTAGRAM_ACCESS_TOKEN` (long-lived Instagram Graph API token) to show the latest @artistsiaaa posts on the home page.

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md): folder structure, dependency rules, how to add features and primitives.
- [DESIGN_SPEC.md](./DESIGN_SPEC.md): colors, typography, components, page specs.

## Deploy

Monorepo on Vercel: import the repo and set **Root Directory** to `web`. Copy `.env.local` values into the Vercel project settings.
