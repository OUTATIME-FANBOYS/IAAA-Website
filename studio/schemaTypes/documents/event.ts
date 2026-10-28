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
    defineField({name: 'typeLabel', type: 'string', description: 'Overrides the type name shown on the page, e.g. Artist’s Retreat.'}),
    defineField({name: 'summary', type: 'text', rows: 3, description: 'Shown in the title card and on event cards.'}),
    defineField({name: 'location', type: 'string', description: 'e.g. Livermore, CA'}),
    defineField({name: 'dateLabel', type: 'string', description: 'Display date, e.g. October 10 – December 6, 2026. Falls back to the year.'}),
    defineField({name: 'startDate', type: 'date', description: 'Enables the “Add to calendar” button.'}),
    defineField({name: 'endDate', type: 'date'}),
    defineField({name: 'sessions', type: 'array', of: [defineArrayMember({type: 'eventSession'})]}),
    defineField({name: 'venue', type: 'string'}),
    defineField({name: 'address', type: 'text', rows: 2}),
    defineField({name: 'description', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({name: 'heroImage', title: 'Cover image', type: 'imageWithAlt', description: 'Wide image behind the title card.'}),
    defineField({
      name: 'figures',
      title: 'Captioned figures',
      type: 'array',
      description: 'Photos in the left column beside the article.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'figure',
          fields: [
            defineField({name: 'image', type: 'imageWithAlt', validation: (r) => r.required()}),
            defineField({name: 'caption', type: 'string'}),
            defineField({name: 'credit', type: 'string', description: 'e.g. Photo: Jane Doe'}),
          ],
          preview: {select: {title: 'caption', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight (poem / quote)',
      type: 'object',
      fields: [
        defineField({name: 'intro', type: 'string'}),
        defineField({name: 'title', type: 'string'}),
        defineField({name: 'lines', type: 'array', of: [defineArrayMember({type: 'string'})]}),
      ],
    }),
    defineField({
      name: 'artworks',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artwork'}]})],
    }),
    defineField({
      name: 'recapPhotos',
      title: 'Gallery photos',
      type: 'array',
      of: [defineArrayMember({type: 'imageWithAlt'})],
    }),
    defineField({name: 'videoUrl', type: 'url'}),
  ],
  orderings: [{title: 'Year, newest', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'year', media: 'heroImage'}},
})
