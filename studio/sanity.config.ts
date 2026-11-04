import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'IAAA',

  projectId: 'jh3pdn6m',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure}), visionTool()],

  document: {
    // Invites must stay drafts (see schemaTypes/documents/memberInvite.ts).
    actions: (prev, {schemaType}) =>
      schemaType === 'memberInvite' ? prev.filter(({action}) => action !== 'publish') : prev,
  },

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => schemaType !== 'siteSettings'),
  },
})
