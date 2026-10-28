import {defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const orgChartSection = defineType({
  name: 'orgChartSection',
  title: 'Organization chart (program model)',
  type: 'object',
  description: 'Officers, advisory board and programs come from Roles and Programs; this holds the labels.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'mission', type: 'text', rows: 2, description: 'Shown in the core mission card.'}),
    defineField({name: 'missionLabel', type: 'string'}),
    defineField({name: 'coreLabel', type: 'string'}),
    defineField({name: 'coreNote', type: 'string'}),
    defineField({name: 'advisoryLabel', type: 'string'}),
    defineField({name: 'advisoryNote', type: 'string'}),
    defineField({name: 'standingLabel', type: 'string'}),
    defineField({name: 'standingNote', type: 'string'}),
    defineField({name: 'popupEyebrow', type: 'string'}),
    defineField({name: 'popupHeading', type: 'string'}),
    toneField,
    defineField({name: 'popupTone', title: 'Pop-up programs background', type: 'string', initialValue: 'blossom', options: {list: [{title: 'Beige', value: 'paper'}, {title: 'Cherry blossom', value: 'blossom'}, {title: 'Pacific blue', value: 'pacific'}], layout: 'radio'}}),
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Organization chart'})},
})
