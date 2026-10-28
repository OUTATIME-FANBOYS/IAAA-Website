import {defineField} from 'sanity'

/** Background band for a page section; matches the site's palette. */
export const toneField = defineField({
  name: 'tone',
  title: 'Background',
  type: 'string',
  initialValue: 'paper',
  options: {
    list: [
      {title: 'Beige (default)', value: 'paper'},
      {title: 'Cherry blossom', value: 'blossom'},
      {title: 'Pacific blue', value: 'pacific'},
    ],
    layout: 'radio',
  },
})

export const ctaStyleField = defineField({
  name: 'style',
  title: 'Button style',
  type: 'string',
  initialValue: 'primary',
  options: {
    list: [
      {title: 'Filled', value: 'primary'},
      {title: 'Outline', value: 'secondary'},
    ],
    layout: 'radio',
  },
})
