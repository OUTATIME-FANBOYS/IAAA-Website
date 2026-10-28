import {defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const memberDirectorySection = defineType({
  name: 'memberDirectorySection',
  title: 'Member directory',
  type: 'object',
  description: 'Filterable list of all members, plus a founding members row.',
  fields: [
    defineField({name: 'allLabel', title: '“All” filter label', type: 'string'}),
    defineField({name: 'countLabel', title: 'Count text', type: 'string', description: 'Use {count}, e.g. Showing {count} members'}),
    defineField({name: 'emptyText', type: 'string'}),
    defineField({name: 'foundersEyebrow', type: 'string'}),
    defineField({name: 'foundersHeading', type: 'string'}),
    toneField,
    defineField({name: 'foundersTone', title: 'Founding members background', type: 'string', initialValue: 'blossom', options: {list: [{title: 'Beige', value: 'paper'}, {title: 'Cherry blossom', value: 'blossom'}, {title: 'Pacific blue', value: 'pacific'}], layout: 'radio'}}),
  ],
  preview: {prepare: () => ({title: 'Member directory', subtitle: 'All members'})},
})

export const eventListSection = defineType({
  name: 'eventListSection',
  title: 'Event list',
  type: 'object',
  description: 'Cards for every event, newest first.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'emptyText', type: 'string'}),
    toneField,
  ],
  preview: {prepare: () => ({title: 'Event list', subtitle: 'All events'})},
})
