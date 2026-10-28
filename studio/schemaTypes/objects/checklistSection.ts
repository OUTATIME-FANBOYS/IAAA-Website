import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const checklistSection = defineType({
  name: 'checklistSection',
  title: 'Heading + list',
  type: 'object',
  description: 'Heading and intro on the left, a divided list of titled items on the right.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    toneField,
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Heading + list'})},
})
