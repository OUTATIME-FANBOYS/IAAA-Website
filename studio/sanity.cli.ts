import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'jh3pdn6m',
    dataset: 'production',
  },
  typegen: {
    enabled: true,
    path: '../web/src/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
  // The hosted Studio: https://iaaa.sanity.studio (deploy with `npx sanity deploy`).
  studioHost: 'iaaa',
  deployment: {
    appId: 'b3dkhhv0px55u6o4kx4ohq27',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
