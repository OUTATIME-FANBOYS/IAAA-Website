import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({name: 'logo', type: 'imageWithAlt'}),
    defineField({
      name: 'navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', type: 'string'}),
            defineField({name: 'href', title: 'URL', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
    defineField({
      name: 'membershipBand',
      type: 'object',
      description: 'Burgundy invitation band shown above the footer.',
      fields: [
        defineField({name: 'heading', type: 'string'}),
        defineField({name: 'body', type: 'text', rows: 3}),
        defineField({name: 'buttonLabel', type: 'string', description: 'e.g. Become a member'}),
        defineField({name: 'price', type: 'string', description: 'e.g. $50 / year'}),
        defineField({name: 'href', title: 'Button URL', type: 'string'}),
      ],
    }),
    defineField({name: 'footerHeading', type: 'string'}),
    defineField({name: 'footerText', title: 'Footer tagline', type: 'string'}),
    defineField({name: 'supportLink', type: 'cta', description: 'e.g. Support our community'}),
    defineField({name: 'footerLinks', type: 'array', of: [defineArrayMember({type: 'cta'})]}),
    defineField({name: 'footerLegal', title: 'Footer legal/caption', type: 'text', rows: 2}),
    defineField({name: 'whatsappUrl', type: 'url'}),
    defineField({name: 'mailingListUrl', type: 'url'}),
    defineField({name: 'instagramUrl', type: 'url'}),
    defineField({name: 'donateUrl', type: 'url'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
