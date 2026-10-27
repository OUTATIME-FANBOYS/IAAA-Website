import {defineArrayMember, defineField, defineType} from 'sanity'

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Rich text', subtitle: 'Rich text'})},
})
