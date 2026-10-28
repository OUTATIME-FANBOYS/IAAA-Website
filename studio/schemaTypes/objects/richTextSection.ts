import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    toneField,
    defineField({name: 'body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Rich text', subtitle: 'Rich text'})},
})
