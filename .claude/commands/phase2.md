---
description: Phase 2 — the green Return Gifts page with product catalogue and WhatsApp quotes
---

Phase 2 only: build /return-gifts following BRIEF.md. Reuse the Phase 1 components and tokens.

1. Set `data-theme="gifts"` so the whole page, header and footer use the green theme.
2. Create data/products.json from the product table in BRIEF.md (name, slug, category, price, mrp, image, description). Write short, warm one-line descriptions; mark them for client review.
3. Sections, in order:
   - Hero: headline about eco-friendly return gifts for weddings and events, layered-leaf visual as in the mockup, peach "Get a quote on WhatsApp" CTA.
   - Category cards: Seeded return gifts, Seed-paper invitations, Thamboolam bags, Plants in jute/ceramic — rounded earth-tone cards like the mockup's grid; clicking one filters the catalogue.
   - Product grid rendered from products.json with a client-side category filter (accessible buttons, "All" default). Cards show image, name, price with MRP struck through, and a "Get quote on WhatsApp" button linking to wa.me/918668196940 with a URL-encoded message naming the product.
   - Bulk-order panel: minimum quantity, customisation (names, dates, logos), lead time, delivery areas — placeholder values clearly marked.
   - Event gallery (placeholder images).
   - FAQ (accessible accordion, 5–6 questions about bulk orders, customisation, delivery, seed growing).
   - Closing WhatsApp quote CTA band.
4. Unique title and meta description targeting "seeded return gifts Chennai", "seed paper wedding invitation Chennai" and "thamboolam bags Chennai".
5. Add any new placeholder images to IMAGES-NEEDED.md.

Run the dev server, check at 375px, 768px and 1440px, fix issues, and tell me what to review.
