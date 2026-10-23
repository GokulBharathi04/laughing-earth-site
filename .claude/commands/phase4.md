---
description: Phase 4 — About, Contact, policy pages, SEO, redirects, performance and launch prep
---

Phase 4 only. Follow BRIEF.md.

1. Build /about: Laughing Earth's story and eco mission, covering both businesses, using the brand line from BRIEF.md. Use a split or alternating layout that nods to both themes.
2. Build /contact: address, click-to-call and WhatsApp, email, Google Map embed for the Villivakkam address, and an enquiry form with a "Which service?" dropdown (Landscaping / Return Gifts / Other) posting to the Formspree placeholder.
3. Build policy pages (/terms, /privacy, /returns, /disclaimer) with clearly marked placeholder copy, and a themed 404 page.
4. SEO: unique title and meta description on every page, one H1 per page, Open Graph tags, LocalBusiness JSON-LD with the address and phone, sitemap.xml, robots.txt, descriptive alt text everywhere.
5. Add a `_redirects` file mapping old URLs to new pages: `/shop*` → `/return-gifts`, `/product/*` → `/return-gifts`, `/products/*` → `/return-gifts`, and old policy and contact paths to their new equivalents.
6. Add a GA4 placeholder (ID as a constant) with events on WhatsApp clicks and form submits.
7. Optimise all images (WebP, responsive sizes, lazy loading below the fold). Run `npm run build`, then a Lighthouse mobile audit on the built site, and fix anything below 90 for performance, accessibility and SEO.
8. Write DEPLOY.md with step-by-step instructions for deploying to Netlify and pointing laughingearthchennai.com at it, plus the list of placeholders I must fill before launch (Formspree ID, GA4 ID, images, client copy).

Finish by going through the Review checklist in BRIEF.md and reporting each item as done or still open.
