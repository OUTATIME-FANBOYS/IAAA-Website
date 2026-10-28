import {defineField, defineType} from 'sanity'
import {toneField} from './shared'

export const instagramSection = defineType({
  name: 'instagramSection',
  title: 'Instagram feed',
  type: 'object',
  description: 'Latest posts load automatically from the Instagram account (needs the access token on the site).',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'blurb', type: 'text', rows: 2, description: 'Shown when posts cannot be loaded.'}),
    defineField({name: 'buttonLabel', type: 'string'}),
    defineField({name: 'profileUrl', type: 'url', validation: (r) => r.required()}),
    defineField({name: 'postCount', type: 'number', initialValue: 6, validation: (r) => r.min(3).max(12)}),
    defineField({name: 'altFallback', title: 'Image alt fallback', type: 'string', description: 'Alt text for posts with no caption.'}),
    toneField,
  ],
  preview: {select: {title: 'heading'}, prepare: ({title}) => ({title, subtitle: 'Instagram feed'})},
})
