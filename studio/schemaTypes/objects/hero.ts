import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'subheading', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'imageWithAlt'}),
    defineField({
      name: 'imageUrl',
      type: 'url',
      description: 'Fallback external image URL, used only when no image is uploaded.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Fallback image alt',
      type: 'string',
      description: 'Alt text for the fallback image URL.',
    }),
    defineField({name: 'cta', title: 'Call to action', type: 'cta'}),
  ],
  preview: {select: {title: 'heading', media: 'image'}, prepare: ({title, media}) => ({title, subtitle: 'Hero', media})},
})
