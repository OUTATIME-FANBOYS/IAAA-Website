import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.documentTypeListItem('newsItem').title('News items'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('member').title('Members'),
      S.documentTypeListItem('role').title('Roles'),
      S.documentTypeListItem('artwork').title('Artworks'),
      S.documentTypeListItem('program').title('Programs'),
    ])
