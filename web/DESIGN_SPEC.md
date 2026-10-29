# IAAA design spec (originally extracted from Framer project "Happy Pudding")

Source of truth for visual design. **All copy, links, labels and images in the page specs below are seeded in Sanity (`studio/seed/content.mjs`) and edited there; this file describes layout and styling only.** Where this conflicts with `.claude/agents/*.md` (Fraunces, Instrument Sans,
maroon nav bar, white-mat Frame, dark join band), THIS FILE WINS. Code structure is described in `ARCHITECTURE.md`.

## Colors (5-color palette)
| token | value | name | use |
|---|---|---|---|
| burgundy | #A92F2F | Brown Red | accent: buttons, labels, site name, membership band bg, link color |
| paper | #F2F5DE | Beige | page background, secondary button fill |
| primary | #2A3D45 | Charcoal Blue | headings, interface text, footer background |
| blossom | #E8AEB7 | Cherry Blossom | footer links, tinted "Ways to get involved" section (30%) |
| pacific | #61A0AF | Pacific Blue | tinted Instagram section (15%), card hover border |
| secondary | #44575F | | body text |
| subtle | #D3D8BB | | dividers, card borders |
| caption | #566A73 | | caption/event detail text |
| white | #FFFFFF | | text/buttons on burgundy, translucent card fill (60%) |
Blossom and Pacific are too light for text on Beige: use them only as backgrounds, accents, or on the dark footer.

## Typography (Google Fonts via next/font: Plus Jakarta Sans, Inter)
Headings use `font-serif` (token name kept; it maps to Plus Jakarta Sans). Body/interface use `font-sans` (Inter).
| style | font | size/line-height | weight | tracking | color |
|---|---|---|---|---|---|
| Display (h1) | Plus Jakarta Sans | 60/1.12 | 500 | -0.5px | primary |
| Section heading (h2) | Plus Jakarta Sans | 38/1.2 | 500 | -0.5px | primary |
| Card heading | Plus Jakarta Sans | 22/1.35 | 500 | 0 | primary |
| Body | Inter | 18/1.6 | 400 | 0 | secondary |
| Label (uppercase eyebrow) | Inter | 14/1.4 | 600 | 1.5px | burgundy |
| Interface (nav/buttons/links) | Inter | 16/1.4 | 600 | 0 | primary |
| Caption | Inter | 16/1.5 | 400 | 0 | caption |
| Site name (nav) | Inter | 19/1.2 | 600 | 0 | burgundy |
Display on tablet/phone should scale down (~44px phone, 60px tablet+). h1 uses text-wrap: balance. Use smart quotes.

## Section background tones
`Section` takes `tone`: `paper` (default beige), `blossom` (cherry blossom 30%) or `pacific` (pacific blue 15%). The first section of a page is always paper; later sections alternate tones so pages read as bands. In use: About (charter blossom, founders pacific), Membership (benefits blossom, dues pacific), Organization (program model pacific, flexible programs blossom), Events (list blossom, related blossom), Members (founders blossom), Member profile (body blossom, appearances pacific), Home (member news blossom, Instagram pacific, ways to get involved blossom).

## Layout
- Breakpoints: Desktop >=1200, Tablet 810-1199, Phone <810.
- Content max-width 1120px, centered. Nav/footer width 93.33% of page up to 1120px.
- Sections: padding 64px 32px (desktop/tablet), 40px 24px (phone). Sections after the first have a 1px top border in subtle.
- Radius 4px everywhere (buttons, cards, images). No shadows.
- Page bg paper (Beige).

## Components
- Button: min-height 48px, padding 12px 24px, radius 4, Interface text, centered. Variants: primary (burgundy bg, white text), inverse (white bg, burgundy text), secondary (1px burgundy border, paper bg, burgundy text). Hover opacity .85, pressed .75, ~0.4s spring-ish transition (use ease/transition 400ms).
- Info card (`InfoCardGrid`): non-interactive; white/60 fill, 1px subtle border, padding 24, radius 4, Card heading, Interface body in secondary, optional bottom label line. Grid 1 col phone, 2 tablet, 3 or 4 desktop.
- Editorial card: **fixed height 200px** (every tile the same size); title trimmed to 2 lines and plain-text details to 3 lines with an ellipsis (full text stays in the page for screen readers); a whole-card link; 1px subtle border, white/60 fill, padding 24px, radius 4, gap 16; Card heading title. Hover: solid white fill + pacific border.
- Editorial link: Interface text, burgundy-ish underline link (hover underline).
- Navigation: sticky bar, paper at the top of the page, turning burgundy once scrolled (StickyHeader, `group-data-[scrolled=true]`). Left: large logo (80px; the light logo variant when scrolled); the site name is screen-reader-only. Links About, Events, Membership, Ways to Give and the Members dropdown, vertically centered, in primary Interface text (white when scrolled). No call-to-action button in the header. Tablet (810–1199): logo stacked above the links. Phone (<810): 56px logo and a hamburger button (accessible names from Site settings → Interface labels) that opens a full-width panel under the bar with the links stacked, then Members, its sub-links and the founding members; the panel follows the bar color (paper, burgundy when scrolled) and closes on link click, Escape or when the screen widens.
- Membership invitation band (all pages except home): full width, burgundy bg, padding 64px 32px, centered, h2 (Section heading, white, max 800px) "Find the community that helps you grow.", body (white, max 720px) "Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.", inverse-style button "Become a member · $50 / year" -> /membership.
- Footer: charcoal (primary) background, paper text. Top row: light IAAA logo (80px, links home) with the title (Card heading) and tagline, and the "Support our community" link in blossom on the right. Below a paper/20 hairline: caption on the left, and on the right four round 40px icon buttons (inline SVG: WhatsApp, Instagram, mail/newsletter, donate heart) with accessible names, paper outline, blossom fill on hover. Stacks on phone.
- Nav link hrefs: /about, /events, /membership, /ways-to-give (Framer uses https://www.indianamericanartists.org/<path>; keep those absolute URLs).

## Home page
1. Hero ("A community for your art"; optional faded background pattern: the Page header has a Background pattern image and a strength setting, default 14%, masked to fade out toward the bottom edge; used on the home page with the quilt photo): section padding 64/32, flex row gap 48, items centered, max 1120. Left (flex 1, gap 24): Label "BY ARTISTS. FOR ARTISTS. WITH COMMUNITY."; h1 Display "Your art has a story. Let’s help it travel further."; Body "Join a growing network of Indian-origin visual artists creating, exhibiting, and building community across the United States."; primary Button "Become a member" -> https://www.indianamericanartists.org/membership. Right (flex 1): artwork image, 480px tall (320 on phone), radius 4, object-cover, src https://framerusercontent.com/images/yus7k8ig8KjhW0sSpjxWEiLcnA.jpg, alt "Representative abstract painting; temporary artwork pending original image upload". Phone: stack vertically, gap 32.
   Tablet: still two columns.
2. Member news (top border, bg blossom/30): Label "FROM OUR COMMUNITY"; h2 "Member news & creative milestones"; grid gap 32px 24px: 4 cols desktop, 2 tablet, 1 phone, of 8 Editorial cards:
   - Geeta Dave’s interview with NPN -> https://npnweb.org/an-interview-with-geeta-dave/
   - Pragati Sharma at Mohr Gallery -> https://www.pragatisharma.com/
   - Pragati Sharma at Richmond Art Center -> https://www.pragatisharma.com/
   - Salma Arastu in the spotlight -> https://www.indianamericanartists.org/member-bios/members/salma-arastu
   - East West: My Journey — Nanda Patel -> https://galleryat808.com/portfolio/exhibition-pieces/
   - Usha Shukla at Fox Chase Cancer Center -> https://www.indianamericanartists.org/member-bios/members/usha-shukla
   - The healing power of art — Sujata Tibrewala -> https://www.healing-power-of-art.org/world-changer-sujata-tibrewala-artist-and-founder-of-iaaa/
   - Geeta Dave: Replenish 2026 resident -> https://www.indianamericanartists.org/member-bios/members/geeta-dave
   Cards in a row stretch to equal height.
3. Instagram feed (top border, bg pacific/15): Label "On Instagram"; h2 "Follow @artistsiaaa"; grid of the latest 6 posts (3 cols tablet+, 2 phone, gap 24/12, square, radius 4, each links to the post, opens new tab); secondary Button "Follow on Instagram" -> https://www.instagram.com/artistsiaaa/. Data: Instagram Graph API via `INSTAGRAM_ACCESS_TOKEN` (revalidate 1h). Without a token or on failure the grid is omitted and a short blurb + the button remain.
4. Ways to get involved (top border, bg blossom/30): h2 centered "Ways to get involved"; 3 centered cards (paper fill, 1px subtle border, padding 32): "Become a member" (primary button "Join for $50 / year" -> /membership), "Donate" (secondary "Give today" -> https://app.donorly.ai/en/donate/iaaa?org_name=iaaa), "Join the community" (secondary "Join WhatsApp" -> WhatsApp link). Below: link "Join our mailing list" -> http://eepurl.com/iULW-Y.
5. Footer (shared layout). The membership band is NOT shown on the home page (its role is covered by section 4); it still appears above the footer on all other pages.
(The former "Artist retreats / Creating connections" section was removed from the home page.)
Page metadata: title "Indian American Artists Association"; description "A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States."

## Event detail page (`/events/[slug]`)
Editorial template modeled on the Wolf-Gordon feature layout.
1. Cover (`FeatureHero`, shared primitive in `components/ui`, used by events and members): full-bleed image, 320px tall (200 phone), pacific/40 fallback when there is no image. A burgundy title card (420px wide, padding 32, radius 4, white text) floats at the top-right of the cover on tablet+, overlaps the cover bottom on phone. Card: label "— {type}" (Label style), h1 (Plus Jakarta Sans 32/semibold), then extra lines (date · location, summary).
2. Body (`EventBody`): 12-col grid on tablet+. Left 5 cols: stack of captioned figures (`EventFigure`: image radius 4, italic caption in primary, small credit line in caption color), gap 40. Right 7 cols: facts list (Date, Venue, Address, Location, schedule) above a subtle rule, article paragraphs (Body), optional highlight (burgundy left rule, title in burgundy, poem lines), optional gallery mosaic (4 cols tablet+, 2 phone, square thumbnails), then "Add to calendar" (only with a start date) and "All events". Without figures the article is centered (cols 3-10).
3. Related events (`RelatedEvents`): bg white/50, top border, h2 "Related events" in burgundy, up to 3 `EventCard`s of other events.
Data lives in `features/events/data.ts` (`coverImage`, `figures`, `gallery`, `highlight` are optional; never invent content).

## Other pages
Shared page pattern: first section has no border (Label, h1, lead paragraph max 720px, actions); later sections have a top border and a Label + h2 header. The membership band is hidden on `/` and `/membership` (each has its own CTA).
- **About** (`/about`): header + "Become a member" and "How we are organized" links; mission and eligibility charter statements verbatim, side by side (`MissionCharter`); "What we do" 4 info cards; founding members as editorial cards linking to bios, plus "Browse all artists".
- **Membership** (`/membership`): header with join button ($50 / year, pays via Donorly); 6 benefit info cards (3 columns); "Who can join" two-column list; dues card (burgundy header with price, blurb, tax/matching notes, join button) on a pacific/15 band.
- **Organization** (`/about/organization`): header with mission, then the program model (`ProgramModel`) in one panel (white/40, 1px subtle border, padding 48): centered "Program model" heading; four officer cards (role initial badge, role label, focus, name chip linking to bio); "The core" dashed box with the charcoal mission card and a connector line; advisory board name chips; standing programs as four 2px-bordered cards (burgundy / pacific / charcoal / blossom borders) with description and an example line. Flexible programs follow as info cards.
Removed from the supplied mockups as repetitive or low-impact: orbit diagram, breadcrumbs, trust/credential badges, "verified" chips, member news (lives on home), inline artist roster with search (lives at `/members`), and the repeated WhatsApp/mailing list/donate/Instagram blocks (lives on home, footer).

## Member profile page (`/members/[slug]`)
Same editorial template as events, on the design-system colors.
1. `FeatureHero`: label "— {role or group}", h1 member name, medium · location. No cover image (portraits are not stretched); the tinted band shows.
2. Body on a cherry-blossom/30 band, 12-col grid: left 5 cols hold the "← All members" link, the portrait (4:5 placeholder with initials when missing) with an italic name caption and medium · location line, then social links; right 7 cols hold the bio paragraphs.
3. Featured work (top border) and Appearances (top border, event cards, "Back to member directory" button) as before.

## Ways to give (`/ways-to-give`)
Centered header (Label "Support South Asian artists & culture", h1 "Ways to give", lead, three trust chips: 501(c)(3), tax-deductible, employer match eligible). Then a blossom band with Label "Giving channels", h2 "Choose how you would like to contribute", and a two-column grid of six white cards (`GivingChannels`), each with a numbered badge, h3, description and its action: online donation (Donorly button), memorials & tributes (dedication guidelines box, treasurer email), Zelle (email box with Copy button), corporate matching (secondary button), DAF (email link), check (payee and mailing address in a mono box). Contact details live in `features/giving/data.ts` and must be confirmed before launch. The Double the Donation employer-match search from the old site is not embedded yet (needs the account embed snippet).

## Interactive states
Every button, link and control has a hover and a pressed state, plus a keyboard focus ring (2px burgundy outline, offset 2px, from `:focus-visible` in `globals.css`):
- Buttons and the Members/hamburger controls: hover fades to 85/70% opacity or a tinted fill; pressed goes to 75/50% and the filled buttons shrink to 98%.
- Editorial links: hover darkens the underline; pressed drops to 65% opacity.
- Cards: hover turns white with a pacific border; pressed gets a burgundy border.
- Footer icon buttons: hover fills blossom; pressed shrinks to 95% and dims.
- Copy button, Instagram tiles, nav links and menu items follow the same hover and pressed pattern.

## Image overlay (lightbox) and artwork tiles
- `ArtworkTile` (ui): square image tile (object-cover, 4px radius, subtle border) with a fixed-height caption (title 2 lines, one detail line, trimmed with an ellipsis), so every tile in a grid is the same size. Grids: 2 columns phone, 3 tablet, 4 desktop.
- `LightboxGroup` / `LightboxTrigger` (ui): clicking a tile opens a full-screen viewer on a near-black overlay with the large image (contained, never cropped), a counter ("2 / 4"), previous/next buttons (wrap around), arrow keys, swipe, and close via the X button, Escape or clicking outside. The caption shows title, details, description and an optional link (e.g. the artist). Focus returns to the tile on close; page scrolling is locked while open. Button names come from Site settings → Interface labels (Image viewer group); without them the viewer still works but is unlabeled.
- Used for: featured work on member pages, the artworks grid, the gallery photos and the captioned figures on event pages (each set is its own slider).
- Event pages do not show the cover image for now (the title card sits on the tinted band); the Cover image field stays in Sanity.
- Members page order: Founding members first, then the filterable directory of all members.
