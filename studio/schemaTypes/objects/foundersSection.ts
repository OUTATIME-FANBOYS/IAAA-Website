import {defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const foundersSection = defineType({
  name: 'foundersSection',
  title: 'Founding members',
  type: 'object',
  description: 'Lists every member marked “Founding member”, in order.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'cardCaption', type: 'string', description: 'Small line on each card, e.g. Read bio'}),
    defineField({name: 'link', type: 'cta', description: 'Link under the cards, e.g. Browse all artists'}),
    toneField,
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Founding members'})},
})
