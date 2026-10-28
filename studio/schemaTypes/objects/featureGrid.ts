import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Card grid',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    defineField({
      name: 'columns',
      type: 'number',
      initialValue: 4,
      options: {list: [{title: '3 columns', value: 3}, {title: '4 columns', value: 4}], layout: 'radio'},
    }),
    toneField,
    defineField({
      name: 'features',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', type: 'text', rows: 3}),
            defineField({name: 'tag', title: 'Small label', type: 'string', description: 'Optional uppercase line at the bottom.'}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Card grid', subtitle: 'Card grid'})},
})
