import {defineField, defineType} from 'sanity'

export const eventSession = defineType({
  name: 'eventSession',
  title: 'Session',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'date', type: 'date'}),
    defineField({name: 'time', type: 'string'}),
  ],
  preview: {select: {title: 'label', subtitle: 'date'}},
})
