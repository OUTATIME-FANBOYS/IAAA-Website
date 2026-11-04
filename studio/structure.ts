import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/** A sidebar folder that opens a list of document types and custom lists. */
const group = (
  S: StructureBuilder,
  title: string,
  id: string,
  items: Parameters<ReturnType<StructureBuilder['list']>['items']>[0],
) => S.listItem().title(title).id(id).child(S.list().title(title).items(items))

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
      group(S, 'Community', 'community', [
        S.documentTypeListItem('member').title('Members'),
        S.listItem()
          .title('Profiles to review')
          .id('profilesToReview')
          .child(
            S.documentList()
              .title('Profiles to review')
              // Studio lists show drafts with the published id (no "drafts." prefix), so filter on the form's timestamp instead.
              .filter('_type == "member" && defined(submittedAt)')
              .defaultOrdering([{field: 'submittedAt', direction: 'desc'}]),
          ),
        S.documentTypeListItem('memberInvite').title('Member invites'),
      ]),
      group(S, 'Events & news', 'eventsAndNews', [
        S.documentTypeListItem('event').title('Events'),
        S.documentTypeListItem('newsItem').title('News items'),
      ]),
      group(S, 'Organization', 'organization', [
        S.documentTypeListItem('role').title('Roles'),
        S.documentTypeListItem('program').title('Programs'),
      ]),
      S.documentTypeListItem('artwork').title('Artworks'),
    ])
