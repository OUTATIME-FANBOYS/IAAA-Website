import {defineArrayMember, defineField, defineType} from 'sanity'

export const linkListSection = defineType({
  name: 'linkListSection',
  title: 'Text + links section',
  type: 'object',
  description: 'Eyebrow, heading, body and a list of editorial links (e.g. artist retreats).',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', type: 'text', rows: 4}),
    defineField({name: 'links', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Text + links'})},
})
