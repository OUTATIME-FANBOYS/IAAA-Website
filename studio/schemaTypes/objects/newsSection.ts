import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const newsSection = defineType({
  name: 'newsSection',
  title: 'News grid section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    toneField,
    defineField({
      name: 'items',
      type: 'array',
      description: 'Leave empty to show all news items, newest first.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'newsItem'}]})],
    }),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'News grid'})},
})
