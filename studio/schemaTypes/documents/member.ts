import {defineArrayMember, defineField, defineType} from 'sanity'

export const member = defineType({
  name: 'member',
  title: 'Member',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'roleTitle', type: 'string'}),
    defineField({
      name: 'group',
      type: 'string',
      initialValue: 'member',
      options: {
        list: [
          {title: 'Leadership', value: 'leadership'},
          {title: 'Advisory', value: 'advisory'},
          {title: 'Member', value: 'member'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'isFounder',
      title: 'Founding member',
      type: 'boolean',
      description: 'Lists this member under “Founding members” in the header menu and on the Members page.',
      initialValue: false,
    }),
    defineField({
      name: 'founderOrder',
      title: 'Founding member order',
      type: 'number',
      description: 'Lower numbers appear first. Leave empty to sort by name.',
      hidden: ({document}) => !document?.isFounder,
    }),
    defineField({name: 'location', type: 'string', description: 'e.g. San Ramon, California'}),
    defineField({name: 'tagline', title: 'Medium / tagline', type: 'string'}),
    defineField({name: 'photo', type: 'imageWithAlt'}),
    defineField({name: 'bio', type: 'array', of: [defineArrayMember({type: 'block'})]}),
    defineField({
      name: 'links',
      type: 'object',
      fields: ['website', 'instagram', 'facebook', 'youtube', 'blog'].map((name) =>
        defineField({name, type: 'url'}),
      ),
    }),
    defineField({
      name: 'featuredArtworks',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'artwork'}]})],
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'roleTitle', media: 'photo'}},
})
