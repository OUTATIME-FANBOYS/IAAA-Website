# To-do

## Artist submissions
- [ ] **Artworks in the first profile form.** Let an artist upload their works (image, title, medium, size, year) right after the profile is saved, creating draft artworks linked to their profile for review. Upload each image in its own request, because Vercel limits request bodies to 4.5 MB.
- [ ] **Artist email and artwork link.** Store email and phone outside Sanity (Neon Postgres with field encryption recommended), send the "add your artworks" link through Resend, and add the upload page. Needs: Resend API key, sending domain, database choice.
- [ ] **Google Form submission workflow (idea).** Artists submit profile updates, press clippings, featured links and artworks through a Google Form. An Apps Script moves each response into Sanity as a draft for review, checks the sender against an allowlist, and rejects non-https links. Open questions: how to limit submitters (Google Group or allowlist check), and how to keep personal data in the sheet restricted.

## Reports
- [ ] **Event report section.** Add a "Project report" group to each Event (title, intro, key figures, story sections, gallery with captions, press links) and render it on the event page. Move the Great Elephant Migration report from its Netlify page into it.
- [ ] **"Create report" button (idea).** An Administrator-only button on the Event in the Studio. It renders the event's page in a print layout (same design as the site), adds any extra images or documents uploaded in a form on the button, makes a PDF with headless Chromium on a Vercel function, uploads it to Sanity, and attaches it to the event. Open questions: who may use it (Studio role plus a server-side check), whether drafts are included, and whether to keep earlier versions.
- [ ] **Report preview on the event page.** When a report is generated, also save an image of its first page. The event page shows that image with a "Download the report" link that opens the PDF. An inline PDF viewer is a later option; it needs the Content-Security-Policy to allow Sanity's file host in frames and doesn't display well on phones.

## Site
- [ ] Upload the real hero image in the Studio (the quilt pattern is a placeholder for the artwork photo).
- [ ] Set `INSTAGRAM_ACCESS_TOKEN` on Vercel so the Instagram section shows posts.
- [ ] Embed the Double the Donation employer-match search on Ways to Give (needs their embed snippet).
- [ ] Confirm members agree to their artwork images appearing on the site.

## Operations
- [ ] Add the Vercel domain to Sanity CORS (credentials off) so live updates work.
- [ ] Turn on two-factor authentication for the GitHub organisation.
- [ ] Delete the private `staging` dataset once it's no longer needed.
- [ ] Plan the `next-sanity` upgrade that clears the 13 (web) and 14 (studio) moderate advisories in Sanity CLI tooling.
