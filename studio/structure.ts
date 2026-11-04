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
      S.listItem()
        .title('Profiles to review')
        .id('profilesToReview')
        .child(
          S.documentList()
            .title('Profiles to review')
            .filter('_type == "member" && _id in path("drafts.**") && defined(submittedAt)')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
        ),
      S.documentTypeListItem('memberInvite').title('Member invites'),
      S.documentTypeListItem('role').title('Roles'),
      S.documentTypeListItem('artwork').title('Artworks'),
      S.documentTypeListItem('program').title('Programs'),
    ])
