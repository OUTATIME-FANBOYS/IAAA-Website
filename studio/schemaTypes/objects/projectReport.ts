import {defineArrayMember, defineField, defineType} from 'sanity'

/** Long-form report attached to an event (the "Project report" group on the Event document). */
export const projectReport = defineType({
  name: 'projectReport',
  title: 'Project report',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', description: 'Shown as the report heading. Give a title or an intro.'}),
    defineField({name: 'intro', type: 'text', rows: 4}),
    defineField({
      name: 'keyFigures',
      title: 'Key figures',
      type: 'array',
      description: 'Short numbers shown as tiles, e.g. “Elephants draped” / “27”.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'keyFigure',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Story sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reportSection',
          fields: [
            defineField({name: 'heading', type: 'string'}),
            defineField({name: 'body', type: 'array', of: [defineArrayMember({type: 'block'})]}),
            defineField({
              name: 'pullQuote',
              title: 'Pull quote',
              type: 'text',
              rows: 2,
              description: 'Optional quote shown large under the text.',
            }),
          ],
          preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Untitled section'})},
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reportImage',
          fields: [
            defineField({name: 'image', type: 'imageWithAlt', validation: (r) => r.required()}),
            defineField({name: 'caption', type: 'string'}),
            defineField({name: 'credit', type: 'string', description: 'e.g. Photo: Jane Doe'}),
          ],
          preview: {select: {title: 'caption', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'pressLinks',
      title: 'Press links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pressLink',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required().uri({scheme: ['https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({name: 'credits', type: 'text', rows: 3, description: 'Who made the report and the project.'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'intro'},
    prepare: ({title, subtitle}) => ({title: title || 'Project report', subtitle}),
  },
})
