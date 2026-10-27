import {defineField, defineType} from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'href', title: 'URL', type: 'string', description: 'Relative (/about) or absolute URL'}),
  ],
})
