import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const quotesSection = defineType({
  name: 'quotesSection',
  title: 'Statements (side by side)',
  type: 'object',
  description: 'Two or three labelled statements, e.g. mission and eligibility.',
  fields: [
    toneField,
    defineField({
      name: 'quotes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'quote',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', type: 'text', rows: 6, validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'text'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Statements', subtitle: 'Side by side'})},
})
