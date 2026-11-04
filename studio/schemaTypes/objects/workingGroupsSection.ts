import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

const text = (name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', description})

/**
 * "Call for leads" page: an intro with key facts, a wall of working-group cards (with live sign-up counts)
 * and a sign-up form. Sign-ups go to the Google Sheet behind CALL_FOR_LEADS_SCRIPT_URL.
 */
export const workingGroupsSection = defineType({
  name: 'workingGroupsSection',
  title: 'Working groups + sign-up',
  type: 'object',
  description: 'Intro, key facts, a card per working group and the sign-up form.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    text('anchorLabel', 'Scroll button label', 'Button that jumps to the sign-up form, e.g. See the roles.'),
    defineField({
      name: 'stats',
      title: 'Key facts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    toneField,
    text('wallEyebrow', 'Groups: eyebrow'),
    text('wallHeading', 'Groups: heading'),
    defineField({name: 'wallIntro', title: 'Groups: intro', type: 'text', rows: 2}),
    defineField({
      name: 'groups',
      title: 'Working groups',
      type: 'array',
      description: 'The name is also what is saved in the sign-up sheet, so keep it short and stable.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'group',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'title', type: 'string', description: 'Short tagline, e.g. Keep the lights on.'}),
            defineField({name: 'quote', type: 'text', rows: 2}),
            defineField({name: 'tasks', type: 'array', of: [defineArrayMember({type: 'string'})]}),
            defineField({name: 'fit', title: 'Good fit for', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'title'}},
        }),
      ],
    }),
    text('fitLabel', 'Label before "good fit"', 'e.g. Fit'),
    text('emptyGroupText', 'Text for a group with no sign-ups', 'e.g. Be the first to join this group'),
    text('countOne', 'One sign-up', 'Use {names} for the names, e.g. 1 member in {names}'),
    text('countMany', 'Several sign-ups', 'Use {count} and {names}, e.g. {count} members in {names}'),
    text('moreNames', 'Extra names', 'Use {count}, e.g. +{count} more'),
    text('formHeading', 'Form: heading'),
    defineField({name: 'formIntro', title: 'Form: intro', type: 'text', rows: 2}),
    text('nameLabel', 'Form: name label'),
    text('emailLabel', 'Form: email label'),
    text('firstChoiceLabel', 'Form: first choice label'),
    text('secondChoiceLabel', 'Form: second choice label'),
    text('optionalLabel', 'Form: optional marker', 'e.g. (optional)'),
    text('pickPlaceholder', 'Form: first choice placeholder'),
    text('noSecondPlaceholder', 'Form: second choice placeholder'),
    text('noteLabel', 'Form: note label'),
    text('notePlaceholder', 'Form: note placeholder'),
    text('submitLabel', 'Form: submit button'),
    text('sendingLabel', 'Form: submit button while sending'),
    text('successHeading', 'Success: heading'),
    defineField({name: 'successBody', title: 'Success: text', type: 'text', rows: 2}),
    text('errorRequired', 'Error: missing fields'),
    text('errorSameGroup', 'Error: same group twice'),
    text('errorGeneric', 'Error: something went wrong'),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Working groups + sign-up'})},
})
