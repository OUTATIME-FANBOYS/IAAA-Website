import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const waysSection = defineType({
  name: 'waysSection',
  title: 'Ways to get involved',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    toneField,
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'way',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'body', type: 'text', rows: 4}),
            defineField({name: 'button', type: 'cta'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
    defineField({name: 'footerLink', type: 'cta', description: 'Text link under the cards.'}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Ways to get involved'})},
})
