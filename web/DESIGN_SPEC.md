# IAAA design spec (originally extracted from Framer project "Happy Pudding")

Source of truth for visual design. Where this conflicts with `.claude/agents/*.md` (Fraunces, Instrument Sans,
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

## Layout
- Breakpoints: Desktop >=1200, Tablet 810-1199, Phone <810.
- Content max-width 1120px, centered. Nav/footer width 93.33% of page up to 1120px.
- Sections: padding 64px 32px (desktop/tablet), 40px 24px (phone). Sections after the first have a 1px top border in subtle.
- Radius 4px everywhere (buttons, cards, images). No shadows.
- Page bg paper (Beige).

## Components
- Button: min-height 48px, padding 12px 24px, radius 4, Interface text, centered. Variants: primary (burgundy bg, white text), inverse (white bg, burgundy text), secondary (1px burgundy border, paper bg, burgundy text). Hover opacity .85, pressed .75, ~0.4s spring-ish transition (use ease/transition 400ms).
- Editorial card: a whole-card link; 1px subtle border, white/60 fill, padding 24px, radius 4, gap 16; Card heading title. Hover: solid white fill + pacific border.
- Editorial link: Interface text, burgundy-ish underline link (hover underline).
- Navigation: paper bar that turns burgundy on scroll (StickyHeader), bottom 1px subtle border, padding 24px 32px, flex row gap 24: site name (burgundy, flex 1) + links About, Events, Membership, Ways to Give (Interface). Tablet/phone: name stacked above links.
- Membership invitation band (all pages except home): full width, burgundy bg, padding 64px 32px, centered, h2 (Section heading, white, max 800px) "Find the community that helps you grow.", body (white, max 720px) "Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.", inverse-style button "Become a member · $50 / year" -> /membership.
- Footer: charcoal (primary) background, paper text, blossom links; max 1120, padding 48px 32px, stack gap 24: Card-heading "Indian American Artists Association"; Body "Empower South Asian artists. Build community. Create impact."; link "Support our community" (/ways-to-give); row (wrap, gap 24) of links: Join WhatsApp community (https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S), Join our mailing list (http://eepurl.com/iULW-Y), Instagram (https://www.instagram.com/artistsiaaa/), Donate (https://app.donorly.ai/en/donate/iaaa?org_name=iaaa); Caption "IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education."
- Nav link hrefs: /about, /events, /membership, /ways-to-give (Framer uses https://www.indianamericanartists.org/<path>; keep those absolute URLs).

## Home page
1. Hero ("A community for your art"): section padding 64/32, flex row gap 48, items centered, max 1120. Left (flex 1, gap 24): Label "BY ARTISTS. FOR ARTISTS. WITH COMMUNITY."; h1 Display "Your art has a story. Let’s help it travel further."; Body "Join a growing network of Indian-origin visual artists creating, exhibiting, and building community across the United States."; primary Button "Become a member" -> https://www.indianamericanartists.org/membership. Right (flex 1): artwork image, 480px tall (320 on phone), radius 4, object-cover, src https://framerusercontent.com/images/yus7k8ig8KjhW0sSpjxWEiLcnA.jpg, alt "Representative abstract painting; temporary artwork pending original image upload". Phone: stack vertically, gap 32.
   Tablet: still two columns.
2. Member news (top border): Label "FROM OUR COMMUNITY"; h2 "Member news & creative milestones"; grid gap 32px 24px: 4 cols desktop, 2 tablet, 1 phone, of 8 Editorial cards:
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
(The former "Artist retreats / Creating connections" section was removed from the home page; `ArtistRetreats` remains in `features/home` unused.)
Page metadata: title "Indian American Artists Association"; description "A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States."
