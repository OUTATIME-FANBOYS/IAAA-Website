# IAAA design spec (extracted from Framer project "Happy Pudding")

Source of truth. Where this conflicts with `.claude/agents/*.md` (Fraunces, Instrument Sans,
maroon nav bar, white-mat Frame, dark join band), THIS FILE WINS.

## Colors
| token | value | use |
|---|---|---|
| burgundy | #8D0428 | accent: buttons, labels, site name, membership band bg |
| paper | #FAF8F5 | page background, card fill, secondary button fill |
| primary | #212121 | headings, interface text |
| secondary | #595454 | body text |
| white | #FFFFFF | text/buttons on burgundy |
| subtle | #DED9D5 | dividers, card borders |
| caption | #666666 | caption/event detail text |

## Typography (Google Fonts: Lora, Source Sans 3)
| style | font | size/line-height | weight | tracking | color |
|---|---|---|---|---|---|
| Display (h1) | Lora | 60/1.12 | 500 | -0.5px | primary |
| Section heading (h2) | Lora | 38/1.2 | 500 | -0.5px | primary |
| Card heading | Lora | 22/1.35 | 500 | 0 | primary |
| Body | Source Sans 3 | 18/1.6 | 400 | 0 | secondary |
| Label (uppercase eyebrow) | Source Sans 3 | 14/1.4 | 600 | 1.5px | burgundy |
| Interface (nav/buttons/links) | Source Sans 3 | 16/1.4 | 600 | 0 | primary |
| Caption | Source Sans 3 | 16/1.5 | 400 | 0 | #666 |
| Site name (nav) | Source Sans 3 | 19/1.2 | 600 | 0 | burgundy |
Display on tablet/phone should scale down (Framer keeps 60px; use ~44px phone, clamp sensibly). h1 uses text-wrap: balance. Use smart quotes.

## Layout
- Breakpoints: Desktop >=1200, Tablet 810-1199, Phone <810.
- Content max-width 1120px, centered. Nav/footer width 93.33% of page up to 1120px.
- Sections: padding 64px 32px (desktop/tablet), 40px 24px (phone). Sections after the first have a 1px top border in subtle.
- Radius 4px everywhere (buttons, cards, images). No shadows.
- Page bg paper.

## Components
- Button: min-height 48px, padding 12px 24px, radius 4, Interface text, centered. Variants: primary (burgundy bg, white text), inverse (white bg, burgundy text), secondary (1px burgundy border, paper bg, burgundy text). Hover opacity .85, pressed .75, ~0.4s spring-ish transition (use ease/transition 400ms).
- Editorial card: a whole-card link; 1px subtle border, paper fill, padding 24px, radius 4, gap 16; Card heading title. Hover opacity .85.
- Editorial link: Interface text, burgundy-ish underline link (hover underline).
- Navigation: paper bar, bottom 1px subtle border, padding 24px 32px, flex row gap 24: site name (burgundy, flex 1) + links About, Events, Membership, Ways to Give (Interface). Tablet/phone: name stacked above links.
- Membership invitation band: full width, burgundy bg, padding 64px 32px, centered, h2 (Section heading, white, max 800px) "Find the community that helps you grow.", body (white, max 720px) "Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.", inverse-style button "Become a member · $50 / year" -> /membership.
- Footer: max 1120, padding 48px 32px, stack gap 24: Card-heading "Indian American Artists Association"; Body "Empower South Asian artists. Build community. Create impact."; link "Support our community" (/ways-to-give); row (wrap, gap 24) of links: Join WhatsApp community (https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S), Join our mailing list (http://eepurl.com/iULW-Y), Instagram (https://www.instagram.com/artistsiaaa/), Donate (https://app.donorly.ai/en/donate/iaaa?org_name=iaaa); Caption "IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education."
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
3. Artist retreats (top border): Label "CREATING CONNECTIONS"; h2 "More than art. A sense of belonging."; Body "Our artist retreats foster stronger bonds within the organization and create meaningful impact in the communities our members call home."; editorial links "2026 Artist’s Retreat · Sausalito, CA" (https://www.indianamericanartists.org/events/2026-artist-retreat) and "2025 Artist’s Retreat · Florence, AL" (https://www.indianamericanartists.org/events/2025-artist-retreat). (A hidden 420px image slot exists in Framer; omit.)
4. Membership band, then footer (shared layout).
Page metadata: title "Indian American Artists Association"; description "A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States."
