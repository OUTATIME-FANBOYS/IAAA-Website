/**
 * Uploads the quilt pattern and sets it as the home page hero background, and adds the mobile-menu labels.
 * Usage: DATASET=production node seed/home-background.mjs <image-path>
 */
import {createClient} from '@sanity/client'
import {createReadStream, readFileSync} from 'node:fs'
import {homedir} from 'node:os'

const dataset = process.env.DATASET ?? 'staging'
const token = JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, 'utf8')).authToken
const client = createClient({projectId: 'jh3pdn6m', dataset, apiVersion: '2026-10-02', token, useCdn: false})

const asset = await client.assets.upload('image', createReadStream(process.argv[2]), {filename: 'quilt-pattern.png'})
await client
  .patch('page-home')
  .set({
    'pageBuilder[_type=="hero"].background': {
      _type: 'imageWithAlt',
      asset: {_type: 'reference', _ref: asset._id},
      alt: 'Decorative quilt pattern',
      // trims the glass reflection on the left and the frame at the top and bottom of the photo
      crop: {_type: 'sanity.imageCrop', top: 0.04, bottom: 0.05, left: 0.1, right: 0.02},
    },
    'pageBuilder[_type=="hero"].backgroundOpacity': 14,
  })
  .commit()
await client.patch('siteSettings').set({'labels.menuOpen': 'Open menu', 'labels.menuClose': 'Close menu'}).commit()
console.log(`${dataset}: hero background and menu labels set (${asset._id})`)
