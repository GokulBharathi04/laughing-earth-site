# Laughing Earth website

Static site for Laughing Earth (Villivakkam, Chennai), built with [Astro](https://astro.build) by Pick your Pixel.
See `BRIEF.md` for the full brief and `START-HERE.md` for the build phases.

## Run locally

Requires **Node.js 22.23.4 or newer** (see `.nvmrc`; Astro 7 needs it).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
```

## Where things live

- `src/styles/tokens.css`: design tokens (colours, fonts, type scale, radius, shadows, spacing, motion)
- `src/styles/themes.css`: `data-theme="landscaping"` / `"gifts"` variable sets and `data-tone` (base / alt / deep)
- `src/components/`: Header, Footer, WhatsAppButton, Button, Section, Card, Logo, Leaves, Icon
- `src/config/site.ts`: business details, nav, policy links, WhatsApp link builder
- `data/products.json`: the Return Gifts catalogue (name, slug, category, price, mrp, image, description). Descriptions with `"descriptionNeedsReview": true` are drafts awaiting the client's approval
- `src/lib/products.ts`: product categories, price formatting and the WhatsApp quote message
- `src/config/gifts.ts`: bulk-order rules and FAQ for Return Gifts. Rules with `placeholder: true` show a "To be confirmed" tag on the page
- `src/pages/`: routes. `/styleguide` is an internal (noindex) page for reviewing the components
- `public/images/`: placeholder images, all listed in `IMAGES-NEEDED.md`
