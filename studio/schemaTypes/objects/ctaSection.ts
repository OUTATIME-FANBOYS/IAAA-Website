import {defineField, defineType} from 'sanity'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'CTA section',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', type: 'text', rows: 3}),
    defineField({name: 'cta', title: 'Call to action', type: 'cta'}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'CTA section'})},
})
