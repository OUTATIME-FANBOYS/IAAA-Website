# IAAA build swarm

Drop the `.claude/agents/` folder into the project root. Claude Code picks these
up automatically (restart the session if the `agents` directory didn't exist
before you added it).

## How to run it

**Wave 1 — foundational, sequential.** Run these first and let them finish
before Wave 2 starts, since every page agent depends on both:

> Use the schema-agent to build the Sanity content model, then use the
> design-system-agent to build the shared components and tokens from the
> Framer design.

**Wave 2 — parallel, isolated worktrees.** Once Wave 1 is merged into your
main branch, kick these off together:

> In parallel, use cms-client-agent to build the Sanity queries, home-page-agent
> to build the home page, member-page-agent to build the member directory and
> bio pages, events-page-agent to build the events pages, and org-structure-agent
> to build the org structure page. They're isolated to worktrees so they won't
> conflict — review and merge each branch when it's ready.

Each of these agents has `isolation: worktree` in its frontmatter, so Claude
Code gives it its own branched copy of the repo. Review each branch's diff
before merging, same as you would a PR.

**Wave 3 — parallel, after Wave 2 is merged.** The test agents need real code
to test against:

> In parallel, use unit-test-agent, integration-test-agent, e2e-test-agent, and
> a11y-test-agent to write tests for everything merged so far.

## Why the waves, not one big parallel dump

Two coding agents editing the same file at the same time is just a merge
conflict waiting to happen — the worktree isolation prevents *disk* conflicts,
not *logical* ones. A page agent that starts before the schema exists will
either stall or invent its own field names that don't match what schema-agent
ships. Sequencing the foundational pieces first, then fanning out, is what
actually makes the parallel part safe.

## Adjusting this for your repo

- If your repo doesn't use Next.js App Router, or structures routes
  differently, edit the `tools`/path references in each agent's body — the
  frontmatter (`tools`, `model`, `isolation`) usually doesn't need to change.
- If you add a page (say, an About page or Ways to Give), copy whichever page
  agent is closest in shape and adjust its "What to render" / "Reference"
  section.
- Keep `design-system-agent` and `schema-agent` as the only agents allowed to
  touch `components/ui/` and `sanity/schemaTypes/` respectively — that
  ownership boundary is what makes the rest of the swarm safe to parallelize.
