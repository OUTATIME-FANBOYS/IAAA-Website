import {defineField, defineType} from 'sanity'

export const role = defineType({
  name: 'role',
  title: 'Role',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'person', type: 'reference', to: [{type: 'member'}]}),
    defineField({
      name: 'group',
      type: 'string',
      options: {
        list: [
          {title: 'Founding', value: 'founding'},
          {title: 'Leadership', value: 'leadership'},
          {title: 'Advisory', value: 'advisory'},
        ],
      },
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'person.name'}},
})
