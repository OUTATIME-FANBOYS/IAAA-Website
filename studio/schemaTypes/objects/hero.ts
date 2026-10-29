import {defineArrayMember, defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Page header (hero)',
  type: 'object',
  description: 'Eyebrow, title, intro, optional image, buttons and small chips. Use first on every page.',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'heading', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'subheading', type: 'text', rows: 3}),
    defineField({name: 'image', type: 'imageWithAlt', description: 'Shows beside the text. Leave empty for a text-only header.'}),
    defineField({
      name: 'imageUrl',
      type: 'url',
      description: 'Fallback external image URL, used only when no image is uploaded.',
    }),
    defineField({
      name: 'imageAlt',
      title: 'Fallback image alt',
      type: 'string',
      description: 'Alt text for the fallback image URL.',
    }),
    defineField({
      name: 'background',
      title: 'Background pattern',
      type: 'imageWithAlt',
      description: 'Faded behind the whole header. Works best with a pattern or texture.',
    }),
    defineField({
      name: 'backgroundOpacity',
      title: 'Background strength (%)',
      type: 'number',
      initialValue: 14,
      validation: (r) => r.min(3).max(60),
      description: 'How visible the background is. 10–20 keeps the text easy to read.',
    }),
    defineField({name: 'cta', title: 'Primary button', type: 'cta'}),
    defineField({name: 'secondaryLink', title: 'Secondary link', type: 'cta'}),
    defineField({
      name: 'chips',
      title: 'Chips',
      type: 'array',
      description: 'Small pills under the intro, e.g. “501(c)(3) nonprofit”.',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'align',
      type: 'string',
      initialValue: 'left',
      options: {list: [{title: 'Left', value: 'left'}, {title: 'Centered', value: 'center'}], layout: 'radio'},
    }),
  ],
  preview: {select: {title: 'heading', media: 'image'}, prepare: ({title, media}) => ({title, subtitle: 'Page header', media})},
})
