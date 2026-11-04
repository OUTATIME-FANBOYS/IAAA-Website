import {defineField, defineType} from 'sanity'
import {InviteLinkInput} from '../components/InviteLinkInput'

const randomToken = () => {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * A personal link to the member profile form. Invites are DRAFT-ONLY on purpose: published documents are
 * readable by anyone through Sanity's public API, which would expose the tokens. The Publish action is
 * removed for this type in sanity.config.ts, and the website only accepts invites that are still drafts.
 */
export const memberInvite = defineType({
  name: 'memberInvite',
  title: 'Member invite',
  type: 'document',
  description:
    'Creates a personal link to the profile form. Never publish an invite: leave it as a draft so the link stays private.',
  fields: [
    defineField({
      name: 'label',
      title: 'Who is this for?',
      type: 'string',
      description: 'For your reference only, e.g. the new member’s name.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'member',
      title: 'Existing member (optional)',
      type: 'reference',
      to: [{type: 'member'}],
      description:
        'Choose a member who is already on the site to let them update their profile. Leave empty for a new member.',
      options: {disableNew: true},
    }),
    defineField({
      name: 'expiresAt',
      title: 'Link expires',
      type: 'datetime',
      initialValue: () => new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'revoked',
      title: 'Turn this link off',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      title: 'Link to send',
      type: 'string',
      readOnly: true,
      components: {input: InviteLinkInput},
    }),
    defineField({
      name: 'token',
      type: 'string',
      readOnly: true,
      initialValue: randomToken,
      description: 'Secret part of the link. Do not change.',
    }),
    defineField({
      name: 'memberId',
      title: 'Member entry created',
      type: 'string',
      readOnly: true,
      description: 'Filled in by the website when the form is submitted.',
    }),
    defineField({name: 'lastSubmittedAt', type: 'datetime', readOnly: true}),
  ],
  preview: {select: {title: 'label', subtitle: 'expiresAt'}},
})
