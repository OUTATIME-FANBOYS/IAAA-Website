import {defineField, defineType} from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({name: 'image', type: 'imageWithAlt', validation: (r) => r.required()}),
    defineField({name: 'title', type: 'string'}),
    defineField({
      name: 'artist',
      type: 'object',
      description: 'A member, or a plain name for guest/non-member artists.',
      fields: [
        defineField({
          name: 'artistType',
          type: 'string',
          initialValue: 'member',
          options: {
            list: [
              {title: 'IAAA member', value: 'member'},
              {title: 'Guest artist (name only)', value: 'name'},
            ],
            layout: 'radio',
          },
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'member',
          type: 'reference',
          to: [{type: 'member'}],
          hidden: ({parent}) => parent?.artistType !== 'member',
          validation: (r) =>
            r.custom((v, ctx) =>
              (ctx.parent as {artistType?: string} | undefined)?.artistType === 'member' && !v
                ? 'Select a member'
                : true,
            ),
        }),
        defineField({
          name: 'name',
          type: 'string',
          hidden: ({parent}) => parent?.artistType !== 'name',
          validation: (r) =>
            r.custom((v, ctx) =>
              (ctx.parent as {artistType?: string} | undefined)?.artistType === 'name' && !v
                ? 'Enter the artist name'
                : true,
            ),
        }),
      ],
    }),
    defineField({name: 'series', type: 'string'}),
    defineField({name: 'dimensions', type: 'string', description: 'e.g. 24x30 inches'}),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({name: 'medium', type: 'string'}),
    defineField({name: 'year', type: 'number'}),
    defineField({
      name: 'legacyUrl',
      title: 'Legacy URL',
      type: 'string',
      description: 'Path on the old site this was imported from (for redirects and QA).',
      readOnly: true,
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'artist.name', media: 'image'}},
})
