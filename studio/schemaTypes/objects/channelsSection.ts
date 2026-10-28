import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const channelsSection = defineType({
  name: 'channelsSection',
  title: 'Giving channels',
  type: 'object',
  description: 'Numbered cards, each with text, an optional detail box, a button and/or a link.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    toneField,
    defineField({
      name: 'channels',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'channel',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', type: 'text', rows: 4}),
            defineField({
              name: 'panel',
              title: 'Detail box',
              type: 'object',
              description: 'Optional box under the text (instructions, an address, an account email).',
              fields: [
                defineField({name: 'heading', type: 'string'}),
                defineField({name: 'lines', type: 'array', of: [defineArrayMember({type: 'string'})]}),
                defineField({name: 'monospace', type: 'boolean', initialValue: false}),
                defineField({name: 'copyValue', title: 'Copyable value', type: 'string', description: 'Shows a copy button, e.g. an email address.'}),
                defineField({name: 'copyLabel', type: 'string', description: 'Copy button label'}),
                defineField({name: 'copiedLabel', type: 'string', description: 'Shown briefly after copying, e.g. Copied'}),
                defineField({name: 'footnote', type: 'string'}),
                defineField({name: 'footnoteLink', type: 'cta', description: 'Link shown after the footnote, e.g. an email.'}),
              ],
            }),
            defineField({name: 'note', type: 'string', description: 'Small print under the card.'}),
            defineField({name: 'button', type: 'cta'}),
            defineField({name: 'link', type: 'cta', description: 'Text link (use instead of, or besides, the button).'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Giving channels', subtitle: 'Giving channels'})},
})
