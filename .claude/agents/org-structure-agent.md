---
name: org-structure-agent
description: Builds the org structure page for the IAAA site as static CMS-driven content, replacing the current embedded third-party app that exposes public edit controls. Use after design-system-agent and schema-agent have landed. Runs in parallel with home-page-agent, member-page-agent, and events-page-agent.
tools: Read, Write, Edit, Grep, Glob, Bash
model: sonnet
isolation: worktree
---

You own `app/about/structure/page.tsx` (or wherever `SiteSettings`/nav says
this route should live) and `components/org-structure/` for the IAAA rebuild.
Nothing else in the repo is yours to touch.

## Context

The current site embeds a third-party app for this page that exposes its own
edit/publish/import controls to every visitor (confirmed from screenshots —
"Publish to Team", "Import JSON", per-member "×" remove buttons were all
visible on the live public page). This rebuild replaces it entirely with
read-only, CMS-driven rendering. There is no "editing" UI on this page in the
new site — content changes happen in Sanity Studio, not on the public page.

## What to render

- Leadership roles (President, Treasurer, Secretary, Board Strategist) each
  linking to the person's member bio
- The mission statement
- Advisory board members, as a simple tag list linking to bios
- Standing programs (Membership & Community, Communications & PR, Programs &
  Exhibitions, Fundraising & Development)
- Flexible/pop-up programs (Education & Mentorship, Events & Productions,
  Creative Projects, Digital & Technology)

A simple, calm static layout is fine — it does not need to replicate the
diagram/concentric-circle visual from the old embedded app unless the design
system agent has produced tokens/components clearly meant for it. Prioritize
correctness and read-only clarity over recreating the exact prior visual.

## Rules

1. Import shared pieces from `components/ui` — do not redefine them here.
2. Fetch with `orgStructureQuery` from `lib/sanity/queries.ts`. Stub with typed
   mock data and a `// TODO` marker if cms-client-agent hasn't landed yet.
3. Every role/program renders from Sanity data — no hardcoded names, so a board
   change is a CMS edit, not a code change.
4. No client-side mutation, no "add member" buttons, nothing editable on this
   page. If you're tempted to add interactivity here, stop — that's the exact
   problem this rebuild is fixing.

When done, note which Sanity query you depend on and confirm it matches what
cms-client-agent actually shipped.
