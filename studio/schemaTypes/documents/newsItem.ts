import {defineField, defineType} from 'sanity'

export const newsItem = defineType({
  name: 'newsItem',
  title: 'News item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'url',
      title: 'External URL',
      type: 'url',
      validation: (r) => r.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'source', type: 'string'}),
    defineField({name: 'image', type: 'imageWithAlt'}),
    defineField({name: 'date', type: 'date'}),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Optional manual ordering (lower first).',
    }),
  ],
  orderings: [
    {title: 'Manual order', name: 'order', by: [{field: 'order', direction: 'asc'}]},
    {title: 'Date, newest', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'url'}},
})
