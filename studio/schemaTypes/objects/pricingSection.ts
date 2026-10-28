import {defineArrayMember, defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const pricingSection = defineType({
  name: 'pricingSection',
  title: 'Price card',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', description: 'Small uppercase line, e.g. Annual membership'}),
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'price', type: 'string', description: 'e.g. $50', validation: (r) => r.required()}),
    defineField({name: 'priceUnit', type: 'string', description: 'e.g. / year'}),
    defineField({name: 'body', type: 'text', rows: 4}),
    defineField({name: 'notesHeading', type: 'string'}),
    defineField({name: 'notes', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'cta', title: 'Button', type: 'cta'}),
    toneField,
  ],
  preview: {select: {title: 'title', subtitle: 'price'}},
})
