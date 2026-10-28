import {defineField, defineType} from 'sanity'
import {ctaStyleField} from './shared'

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'href', title: 'URL', type: 'string', description: 'Relative (/about) or absolute URL'}),
    ctaStyleField,
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})
