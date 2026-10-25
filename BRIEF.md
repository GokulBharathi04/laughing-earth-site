# Laughing Earth — Static Website Brief

Rebuild laughingearthchennai.com as a fast static site that presents Laughing Earth's two businesses, **Landscaping** and **Return Gifts**, and turns visitors into WhatsApp and form enquiries instead of online orders.

## 1. Project overview

- **Client:** Laughing Earth, Villivakkam, Chennai
- **Businesses:** (1) Landscaping and garden services; (2) Eco-friendly return gifts: seeded gifts, seed-paper wedding invitations, thamboolam bags, potted plants
- **Change from current site:** no cart, login, OTP or online payment. Prices stay visible; buying happens through an enquiry.
- **Primary goal:** more qualified enquiries, especially bulk wedding/event orders and landscaping project leads
- **Secondary goals:** rank locally in Chennai for both businesses; look premium and earthy; easy and cheap to maintain
- **Visual reference:** `reference/mockup.png` (split hero, layered leaves, rounded feature panel, earth-tone card grid). Match its feel, not its placeholder text.

## 2. Site structure and pages

1. **Home (`/`)** — full-screen split chooser: Landscaping on the left in muddy brown and beige, Return Gifts on the right in green.
   - Desktop: hovering a half expands it to ~65% width and dims the other; clicking slides into that page with a smooth transition.
   - Mobile: halves stack top and bottom; tap to enter.
   - Logo centred over the split; short line under it, e.g. "Gardens that grow. Gifts that grow."
2. **Landscaping (`/landscaping`)** — hero with garden photo and CTA; services grid (garden design, lawn setup, vertical gardens, terrace gardens, maintenance); project gallery with before/after slider; 4-step process; FAQ; enquiry form + WhatsApp CTA.
3. **Return Gifts (`/return-gifts`)** — hero; category cards (Seeded return gifts, Seed-paper invitations, Thamboolam bags, Plants in jute/ceramic); product catalogue with prices and category filter; bulk-order panel (minimum quantity, customisation, lead time); event gallery; FAQ; WhatsApp quote CTA.
4. **About (`/about`)** — story and eco mission, covering both businesses.
5. **Contact (`/contact`)** — address, phone/WhatsApp, email, Google Map embed, enquiry form with a "Which service?" dropdown.
6. **Shared** — sticky header with a Landscaping / Return Gifts switch; floating WhatsApp button on every page; footer with links, Instagram, policies, current-year copyright, credit "Designed & Developed by Pick your Pixel".

## 3. Design system

Earthy, tactile and calm: deep greens and warm browns, soft rounded shapes, real nature photography as the hero.

| Token | Hex | Use |
| --- | --- | --- |
| Forest green | #1F4D45 | Main backgrounds, Return Gifts theme |
| Teal green | #2E6B5E | Panels, gradients (Return Gifts) |
| Sage | #7FA36B | Secondary cards, tags; small leaf icons on Landscaping |
| Chocolate brown | #5A3A2A | Deep sections and CTA, Landscaping theme |
| Warm tan | #A47551 | Accents, icons (Landscaping) |
| Beige | #D9C4A5 | Main backgrounds, Landscaping theme |
| Cream | #F4E9D8 | Headings on dark, light page backgrounds |
| Peach (CTA) | #E8B98A | Primary buttons on dark backgrounds |
| Ink | #1E1E1A | Body text on light backgrounds |

### Section themes

Each business has its own colourway on the same design system — one brand, two moods.

- **Landscaping = muddy brown and beige.** Beige and cream backgrounds, warm tan accents, chocolate brown for hero and deep bands. Ink text on beige, cream text on brown. CTA: chocolate brown pill with cream text on light sections, peach on brown sections. Sage only for small leaf icons.
- **Return Gifts = green**, as in the mockup. Forest green and teal backgrounds, sage cards, cream headings, peach CTA.
- **Home split:** left half Landscaping theme, right half Return Gifts theme.
- **Implementation:** `data-theme="landscaping"` or `data-theme="gifts"` on the page swaps CSS variable sets. Header, footer and WhatsApp button inherit the page theme. Components read colours only from variables — never hard-coded.

### Typography

- Headings: Fraunces (fallback Cormorant Garamond), 600 weight; hero 56–72px desktop, 36–40px mobile
- Body: Inter (or DM Sans), 16–18px, line-height 1.6; never smaller than 15px
- Scale: 72 / 48 / 32 / 24 / 18 / 16 px

### Shapes and depth

- Radius: 24px cards and panels, 999px pill buttons, 16px images
- Shadows: soft and large, e.g. `0 20px 40px rgba(0,0,0,0.18)`, plus a subtle inner highlight for a tactile feel
- Textures: fine leaf-vein or paper grain overlay at 5–8% opacity on coloured bands

### Imagery

- Landscaping: wide, sunlit garden photos; before/after pairs
- Return Gifts: products on natural surfaces (jute, wood, leaves), warm light, consistent square crops
- Decorative layered leaves in heroes, as in the mockup

### Motion

- Split-screen hover: width transition 600ms ease-out; inactive half gets a 40% dark overlay
- Sections fade-and-rise 400ms as they scroll into view
- Cards lift 4px and deepen shadow on hover
- Respect `prefers-reduced-motion`; no scroll hijacking

**Readability rule:** body text on dark green or brown is cream at 16px+, and all text meets WCAG AA contrast (4.5:1).

## 4. Content

### Products (₹, from the current site, October 2026)

| Product | Category | Price | MRP |
| --- | --- | --- | --- |
| Succulent in ceramic pot wrapped with jute | Plants | 150 | 170 |
| Succulent in plastic pot wrapped with jute | Plants | 99 | 120 |
| Jade wrapped with jute | Plants | 85 | 95 |
| Sapling with paper bag and thank-you card | Seeded return gifts | 35 | 40 |
| Sapling with eco-friendly customised bag | Thamboolam bags | 55 | 60 |
| Customisable thamboolam bag 8.8×6×3 | Thamboolam bags | 35 | 40 |
| Customisable thamboolam bag 8.8×10.5×3 | Thamboolam bags | 40 | 45 |
| Customisable thamboolam bag 10.5×12×4 | Thamboolam bags | 50 | 55 |
| Customisable thamboolam bag 12×14×4 | Thamboolam bags | 60 | 65 |
| Aesthetic wedding card | Seed-paper invitations | 50 | 90 |

More products will be added later via `data/products.json`.

### Business details

- **Address:** 8B, Sastha Nagar Annex, opposite Thathan Kuppam lake, Rajiv Gandhi Nagar, Villivakkam, Chennai, Tamil Nadu 600049
- **Call / WhatsApp:** +91 86681 96940 (wa.me/918668196940)
- **Email:** info@laughingearth.in
- **Instagram:** https://www.instagram.com/laughingearth_plantshop/
- **Brand line:** "At Laughing Earth, we believe that plants have the power to bring joy, peace, and beauty to every space."
- **Policy pages:** terms, privacy, returns, disclaimer (placeholder copy until the client supplies final text)

### Still to come from the client (use clearly named placeholders)

Landscaping services and pricing, landscaping project photos (before/after), hero photos, full product catalogue and photos, bulk-order rules (minimum quantity, lead time, delivery areas), customer reviews, final logo files.

## 5. Technical requirements

- **Stack:** Astro with static output; no backend, no database
- **Products:** `data/products.json` (name, slug, category, price, mrp, image, description); catalogue renders from it and filters by category client-side
- **Enquiries:** WhatsApp click-to-chat links `https://wa.me/918668196940?text=...` with a pre-filled message naming the product or service; forms via Formspree (endpoint as a placeholder constant)
- **SEO:** unique title and meta description per page; one H1 per page; clean URLs; Open Graph tags; `LocalBusiness` JSON-LD with the Villivakkam address; `sitemap.xml`; `robots.txt`; descriptive alt text
- **Target keywords:** landscaping services Chennai, garden designer Chennai, seeded return gifts Chennai, seed paper wedding invitation Chennai, thamboolam bags Chennai, eco-friendly return gifts
- **Performance:** WebP/AVIF images, lazy-loaded, responsive sizes; Lighthouse mobile 90+ for performance, accessibility and SEO
- **Accessibility:** keyboard-usable split screen; visible focus; no `maximum-scale` in viewport meta; reduced-motion support; tap targets 44px+
- **Hosting:** Netlify or Cloudflare Pages
- **Analytics:** GA4 placeholder with events on WhatsApp clicks and form submits
- **Redirects:** `_redirects` mapping old URLs (`/shop*`, `/product/*`, `/products/*`) to the new pages

## 6. Review checklist

- [ ] Split screen works with mouse, touch and keyboard; mobile stacks cleanly
- [ ] Every WhatsApp button opens chat with the right pre-filled message
- [ ] Forms post to the configured endpoint
- [ ] Prices match `data/products.json`; no conflicting coupon codes
- [ ] No placeholder text left before launch (placeholder images listed in `IMAGES-NEEDED.md`)
- [ ] Text readable on dark backgrounds; nothing under 16px body
- [ ] Unique title and description on every page
- [ ] Old URLs redirect
- [ ] Lighthouse mobile 90+
- [ ] Footer shows the current year and "Designed & Developed by Pick your Pixel"
