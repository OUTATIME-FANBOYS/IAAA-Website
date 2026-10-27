import {defineField, defineType} from 'sanity'

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'kind',
      type: 'string',
      options: {
        list: [
          {title: 'Standing', value: 'standing'},
          {title: 'Pop-up', value: 'popup'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({name: 'icon', type: 'imageWithAlt'}),
  ],
  preview: {select: {title: 'name', subtitle: 'kind', media: 'icon'}},
})
