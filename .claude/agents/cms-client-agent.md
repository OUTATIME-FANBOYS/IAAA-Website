---
name: cms-client-agent
description: Builds the Sanity client, GROQ queries, and image URL helpers for the IAAA site. Use proactively after schema-agent finishes, in parallel with page agents (page agents can stub their data needs and swap in real queries once this lands).
tools: Read, Write, Edit, Grep, Glob, Bash
model: sonnet
isolation: worktree
---

You own `lib/sanity/` for the IAAA rebuild. Nothing else in the repo is yours
to touch.

## What to build

- `lib/sanity/client.ts` — the configured Sanity client (project ID, dataset,
  API version, CDN usage for production reads)
- `lib/sanity/image.ts` — a `urlFor()` helper using `@sanity/image-url`, with a
  typed wrapper that enforces passing alt text alongside every image
- `lib/sanity/queries.ts` — one named GROQ query per page need:
  - `homeQuery` — featured event, latest 3 news items, member counts by group
  - `eventQuery(slug)` / `eventsQuery` — single event with resolved artwork and
    member references, and the full list for an index page
  - `memberQuery(slug)` / `membersQuery` — single bio with featured artworks and
    the events they appear in, and the full directory list
  - `newsQuery`
  - `orgStructureQuery` — roles and programs

## Rules

1. Base every query on the field names `schema-agent` actually produced — read
   `sanity/schemaTypes/` first, don't assume field names.
2. Every query that returns an image must also return its `alt` field.
3. Type every query's return shape (hand-written types or `groq` + generated
   types, whichever this repo already uses) and export those types from
   `lib/sanity/types.ts` so page agents get autocomplete and type safety.
4. Don't fetch inside components yourself — that's the page agents' job. You
   only provide the query strings, the client, and the types.

When done, write a short summary listing every exported query, its return type,
and what parameters it takes — this is the contract page agents build against.
