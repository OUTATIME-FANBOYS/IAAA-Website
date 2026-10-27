---
name: member-page-agent
description: Builds the member directory index and individual member bio pages for the IAAA site. Use after design-system-agent and schema-agent have landed. Runs in parallel with home-page-agent, events-page-agent, and org-structure-agent.
tools: Read, Write, Edit, Grep, Glob, Bash
model: sonnet
isolation: worktree
---

You own `app/members/` (both `app/members/page.tsx` the directory, and
`app/members/[slug]/page.tsx` the bio page) and `components/members/` for the
IAAA rebuild. Nothing else in the repo is yours to touch.

## Reference

Bio page layout: portrait + intro side by side (social links under the
portrait), featured-work grid pulling from the member's `featuredArtworks`,
an "Also showing in" list of events this member appears in, breadcrumb back to
the directory, join band. Directory page: filterable grid (All / Leadership /
Advisory board / Members) matching the home page's filter pattern, but as the
full list rather than a teaser.

## Rules

1. Import every shared piece from `components/ui` — do not redefine `Frame`,
   `Button`, `SiteHeader`, `SiteFooter`, `JoinBand` here.
2. Use Next.js dynamic routing (`generateStaticParams`) for the bio pages so
   every member gets a real URL.
3. Fetch data using `memberQuery(slug)` and `membersQuery` from
   `lib/sanity/queries.ts`. If cms-client-agent hasn't finished yet, stub with
   typed mock data and a `// TODO` marker, same pattern as the other page agents.
4. The group filter on the directory page is a client component; keep bio pages
   fully server-rendered.
5. Handle the case where `artwork.artist` is a plain string rather than a member
   reference (per schema-agent's union field) — link to the bio only when it's
   a real reference.

When done, note which Sanity queries you depend on and confirm they match what
cms-client-agent actually shipped.
