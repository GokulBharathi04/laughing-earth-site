# Images needed

Every placeholder image in the site. Replace each file in `public/images/` with a
real photo **using the same filename**, so no code changes are needed. Export as
WebP (quality 75–80); AVIF variants can be added in Phase 4.

| File | Where it's used | What it should show | Ideal size |
| --- | --- | --- | --- |
| `home-split-landscaping-garden.webp` | Home: left (Landscaping) half. Arch-shaped photo on desktop, soft tinted backdrop on mobile | A wide, sunlit garden designed by Laughing Earth: lawn, planted borders, warm light. Keep the main subject centred, because the arch crops the sides | 1600 × 2000 px (4:5 portrait), under 250 KB |
| `home-split-landscaping-garden-800.webp` | Same, small-screen version | Same photo, resized | 800 × 1000 px, under 90 KB |
| `home-split-return-gifts-products.webp` | Home: right (Return Gifts) half | Return gifts on a natural surface (jute, wood, leaves): potted succulents, sapling with thank-you card, thamboolam bag. Warm light, centred | 1600 × 2000 px (4:5 portrait), under 250 KB |
| `home-split-return-gifts-products-800.webp` | Same, small-screen version | Same photo, resized | 800 × 1000 px, under 90 KB |
| `return-gifts-hero-seeded-favours-on-jute.webp` | Return Gifts: hero, arch-shaped photo beside the headline | A styled flat-lay of return gifts (jute-wrapped succulent, sapling in a paper bag, thank-you card) on jute, warm light, subject centred | 1200 × 1500 px (4:5 portrait), under 220 KB |
| `return-gifts-hero-seeded-favours-on-jute-800.webp` | Same, small-screen version | Same photo, resized | 800 × 1000 px, under 90 KB |

## Return Gifts: product photos (`public/images/products/`)

One photo per product in `data/products.json`. Use **consistent square crops**: the
product centred on a natural surface (jute, wood or leaves), with the same warm light and
camera height across the set. Each needs a full-size file and a `-600` version.

| File (plus `-600.webp`) | Product | Ideal size |
| --- | --- | --- |
| `products/succulent-ceramic-pot-jute.webp` | Succulent in ceramic pot wrapped with jute | 1200 × 1200 px (600 × 600 for `-600`), under 150 KB |
| `products/succulent-plastic-pot-jute.webp` | Succulent in plastic pot wrapped with jute | same |
| `products/jade-plant-jute.webp` | Jade wrapped with jute | same |
| `products/sapling-paper-bag-thank-you-card.webp` | Sapling with paper bag and thank-you card | same |
| `products/sapling-eco-customised-bag.webp` | Sapling with eco-friendly customised bag | same |
| `products/thamboolam-bag-8-8x6x3.webp` | Customisable thamboolam bag 8.8×6×3 | same |
| `products/thamboolam-bag-8-8x10-5x3.webp` | Customisable thamboolam bag 8.8×10.5×3 | same |
| `products/thamboolam-bag-10-5x12x4.webp` | Customisable thamboolam bag 10.5×12×4 | same |
| `products/thamboolam-bag-12x14x4.webp` | Customisable thamboolam bag 12×14×4 | same |
| `products/aesthetic-wedding-card.webp` | Aesthetic wedding card (seed paper) | same |

New products: add the entry to `data/products.json` and put its photo at the path in its
`image` field, along with a `-600.webp` copy.

## Return Gifts: event gallery (`public/images/gallery/`)

Real photos from the client's events. Landscape 4:3; the first one is shown large on desktop.
Each needs a full-size file and a `-800` version.

| File (plus `-800.webp`) | What it should show | Ideal size |
| --- | --- | --- |
| `gallery/event-wedding-return-gift-table.webp` | A wedding return-gift table set up with favours (featured, shown largest) | 1600 × 1200 px (800 × 600 for `-800`), under 220 KB |
| `gallery/event-seed-paper-invitation-suite.webp` | Seed-paper wedding invitations, styled | same |
| `gallery/event-thamboolam-bags-stacked.webp` | Customised thamboolam bags ready for guests | same |
| `gallery/event-housewarming-sapling-gifts.webp` | Sapling gifts at a housewarming | same |
| `gallery/event-corporate-plant-gifting.webp` | Plants prepared for a corporate gifting event | same |
| `gallery/event-baby-shower-succulent-favours.webp` | Succulent favours at a baby shower | same |

If the actual events differ, rename the files and update the captions and alt text in
`src/pages/return-gifts.astro`.

## Logo

The logo is currently a placeholder (a sprout mark plus a "Laughing Earth"
wordmark) in `src/components/Logo.astro`, with a matching `public/favicon.svg`.

Needed from the client: the final logo as **SVG** (preferred) or a transparent
PNG at least 1000 px wide, in versions for light and dark backgrounds, plus a
square icon for the favicon (512 × 512 px).

## Coming in later phases

Landscaping hero, services and before/after photos will be added in Phase 3.
