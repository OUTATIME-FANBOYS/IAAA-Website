/**
 * Fills the "Call for Program Leads" page (membership/callforleads) with the working-groups section:
 * intro, key facts, seven group cards and the sign-up form text. Keeps the page's existing hero.
 * Content is copied from the old Google Sites page. Safe to re-run (it replaces only that section).
 *
 * Auth: the token from `sanity login`. Usage:
 *   node seed/leads.mjs                      # production
 *   DATASET=staging node seed/leads.mjs      # another dataset
 *   DRY_RUN=1 node seed/leads.mjs            # show what would change
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'

const dataset = process.env.DATASET || 'production'
const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: 'jh3pdn6m', dataset, apiVersion: '2026-10-02', token, useCdn: false, perspective: 'raw'})

const group = (name, title, quote, tasks, fit, key) => ({_key: key, _type: 'group', name, title, quote, tasks, fit})

const section = {
  _key: 'workinggroups',
  _type: 'workingGroupsSection',
  eyebrow: 'Indian American Artists Association',
  heading: 'Seven roles. One community. Your pick.',
  intro:
    'IAAA runs on members who step up. We’re opening seven working groups — pick the one that fits your skills, your time, and what you actually want to spend your energy on.',
  anchorLabel: 'See the roles',
  tone: 'paper',
  stats: [
    {_key: 's1', _type: 'stat', label: 'Members', value: '~50 artists'},
    {_key: 's2', _type: 'stat', label: 'Working groups', value: '7 open'},
    {_key: 's3', _type: 'stat', label: 'Time ask', value: '2–5 hrs / month'},
    {_key: 's4', _type: 'stat', label: 'Sign-ups close', value: 'July 31, 2026'},
  ],
  wallEyebrow: 'The wall',
  wallHeading: 'Find your frame.',
  wallIntro: 'Each group needs a handful of people, not a hero. Read through, then claim the one (or two) that pull at you.',
  groups: [
    group('Fundraising', 'Keep the lights on', 'Every grant we win is a show we can afford to put on.',
      ['Find & apply for grants and sponsorships', 'Run 1–2 fundraising campaigns a year', 'Steward donor relationships'], 'Networkers, writers', 'g1'),
    group('Membership', 'Make people feel found', 'The first email someone gets from IAAA shapes whether they stay.',
      ['Welcome & onboard new members', 'Track renewals and engagement', 'Collect member feedback'], 'Organizers, connectors', 'g2'),
    group('Finance', 'Numbers people trust', 'Transparent books are how a small nonprofit earns trust.',
      ['Track budget, income & expenses', 'Support the treasurer with reporting', 'Keep filings & receipts in order'], 'Detail-minded, spreadsheets', 'g3'),
    group('Exhibitions', 'Get the work on the wall', 'This is the group that turns art into an event people show up for.',
      ['Source & book exhibition venues', 'Curate submitted artwork', 'Handle setup, labeling, logistics'], 'Curatorial eye, logistics', 'g4'),
    group('Events', 'Set the room alive', 'Good events are why people remember they’re part of something.',
      ['Plan the year’s event calendar', 'Coordinate venues & volunteers', 'Promote to members & community'], 'Planners, hosts', 'g5'),
    group('Education', 'Grow the craft', 'Every member should be a little better at their art because IAAA exists.',
      ['Organize workshops & artist talks', 'Curate learning resources', 'Survey members on topics of interest'], 'Teachers, subject experts', 'g6'),
    group('Mentorship', 'Pass it forward', 'The most senior artists here started exactly where our newest members are now.',
      ['Match mentors with mentees', 'Run periodic check-ins', 'Track outcomes & gather feedback'], 'Patient, relationship-driven', 'g7'),
  ],
  fitLabel: 'Fit',
  emptyGroupText: 'Be the first to join this group',
  countOne: '{count} member in {names}',
  countMany: '{count} members in {names}',
  moreNames: '+{count} more',
  formHeading: 'Pick up to two. We’ll take it from there.',
  formIntro:
    'Fill out one short form. We’ll follow up by Aug 01, 2026 to confirm your group and introduce you to your fellow leads.',
  nameLabel: 'Your name',
  emailLabel: 'Email',
  firstChoiceLabel: 'First choice',
  secondChoiceLabel: 'Second choice',
  optionalLabel: '(optional)',
  pickPlaceholder: '— pick a group —',
  noSecondPlaceholder: '— no second group —',
  noteLabel: 'Anything you’d like us to know?',
  notePlaceholder: 'Skills, questions, availability…',
  submitLabel: 'Claim your role →',
  sendingLabel: 'Submitting…',
  successHeading: 'You’re in. ✦',
  successBody: 'We’ll follow up by Aug 01, 2026 to confirm your group and make introductions.',
  errorRequired: 'Please fill in your name, a valid email, and your first choice.',
  errorSameGroup: 'Please pick two different groups, or leave the second choice blank.',
  errorGeneric:
    'Something went wrong. Please try again or email treasurer@indianamericanartists.org.',
}

const id = 'page-membership-callforleads'
const page = await client.getDocument(id)
if (!page) throw new Error(`${id} not found in ${dataset}`)
const hero = (page.pageBuilder ?? []).find((s) => s._type === 'hero') ?? {
  _key: 'hero', _type: 'hero', heading: 'Call for Program Leads',
}
const next = [hero, section]
console.log(`${dataset}: ${id} sections ${(page.pageBuilder ?? []).map((s) => s._type).join(', ')} -> ${next.map((s) => s._type).join(', ')}`)
if (process.env.DRY_RUN) process.exit(0)
await client.patch(id).set({pageBuilder: next}).commit()
console.log('done')
