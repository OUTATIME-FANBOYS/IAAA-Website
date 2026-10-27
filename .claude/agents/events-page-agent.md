---
name: events-page-agent
description: Builds the events index and individual event detail pages for the IAAA site. Use after design-system-agent and schema-agent have landed. Runs in parallel with home-page-agent, member-page-agent, and org-structure-agent.
tools: Read, Write, Edit, Grep, Glob, Bash
model: sonnet
isolation: worktree
---

You own `app/events/` (`app/events/page.tsx` the index, and
`app/events/[slug]/page.tsx` the detail page) and `components/events/` for the
IAAA rebuild. Nothing else in the repo is yours to touch.

## Reference

Detail page: featured exhibit treatment (kicker, title, venue/address, session
schedule as a definition list, description, works grid with artist credits
that link to member bios where possible). Index page: upcoming/featured event
first, then a chronological list of past events (retreats, fundraisers, monthly
meetings), each with type, date, and a short description. No colored category
chips — plain text labels, per the approved simplified direction.

## Rules

1. Import every shared piece from `components/ui` — do not redefine `Frame`,
   `Button`, `SiteHeader`, `SiteFooter`, `JoinBand` here.
2. Use `generateStaticParams` for event detail pages.
3. Fetch with `eventQuery(slug)` / `eventsQuery` from `lib/sanity/queries.ts`.
   Stub with typed mock data and a `// TODO` marker if cms-client-agent hasn't
   landed yet.
4. Replace the old Google Calendar iframe with an "Add to calendar" link
   pattern (generate a .ics or Google Calendar URL from the event's date/time
   fields) rather than embedding anything.
5. Artist credits in the works grid: link to the member bio when `artwork.artist`
   is a member reference, otherwise render plain text — same rule as
   member-page-agent uses.

When done, note which Sanity queries you depend on and confirm they match what
cms-client-agent actually shipped.
