import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/** A sidebar folder that opens a list of document types and custom lists. */
const group = (
  S: StructureBuilder,
  title: string,
  id: string,
  items: Parameters<ReturnType<StructureBuilder['list']>['items']>[0],
) => S.listItem().title(title).id(id).child(S.list().title(title).items(items))

/** Artworks → artist → their artworks. Guest artists (name only) and the full list sit beside the member list. */
const artworks = (S: StructureBuilder) =>
  S.listItem()
    .title('Artworks')
    .id('artworks')
    .child(
      S.list()
        .title('Artworks')
        .items([
          S.listItem()
            .title('By artist')
            .id('artworksByArtist')
            .child(
              S.documentList()
                .title('Artists with artworks')
                .filter('_type == "member" && _id in *[_type == "artwork"].artist.member._ref')
                .defaultOrdering([{field: 'name', direction: 'asc'}])
                .child((memberId) =>
                  S.documentList()
                    .title('Artworks')
                    .schemaType('artwork')
                    .filter('_type == "artwork" && artist.member._ref == $memberId')
                    .params({memberId})
                    .initialValueTemplates([]),
                ),
            ),
          S.listItem()
            .title('Guest artists')
            .id('artworksGuest')
            .child(
              S.documentList()
                .title('Guest artists')
                .schemaType('artwork')
                .filter('_type == "artwork" && artist.artistType == "name"')
                .defaultOrdering([{field: 'artist.name', direction: 'asc'}]),
            ),
          S.divider(),
          S.documentTypeListItem('artwork').title('All artworks'),
        ]),
    )

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
      artworks(S),
    ])
