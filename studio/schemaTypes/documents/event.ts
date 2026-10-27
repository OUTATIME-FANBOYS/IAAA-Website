import {defineArrayMember, defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'year', type: 'number', validation: (r) => r.required()}),
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Retreat', value: 'retreat'},
          {title: 'Exhibition', value: 'exhibition'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({name: 'sessions', type: 'array', of: [defineArrayMember({type: 'eventSession'})]}),
    defineField({name: 'venue', type: 'string'}),
    defineField({name: 'address', type: 'text', rows: 2}),
    defineField({name: 'description', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'heroImage', type: 'imageWithAlt'}),
    defineField({
      name: 'artworks',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artwork'}]})],
    }),
    defineField({
      name: 'recapPhotos',
      type: 'array',
      of: [defineArrayMember({type: 'imageWithAlt'})],
    }),
    defineField({name: 'videoUrl', type: 'url'}),
  ],
  orderings: [{title: 'Year, newest', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'year', media: 'heroImage'}},
})
