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
- `src/pages/`: routes. `/styleguide` is an internal (noindex) page for reviewing the components
- `public/images/`: placeholder images, all listed in `IMAGES-NEEDED.md`
- `data/products.json`: return gift categories and products (prices from the brief); the catalogue renders from it

## Motion layer

GSAP 3.13 and Lenis 1.3 (npm, pinned) power a small set of opt-in modules in
`src/scripts/motion/`, started from `BaseLayout` once fonts are ready. Each does
nothing on pages without its markup, and all respect `prefers-reduced-motion`.

| Hook | Module | What it does |
| --- | --- | --- |
| (always) | `smooth-scroll.ts` | Smooths mouse-wheel scrolling on desktop pointers only. Touch, keys and scrollbar stay native; nothing snaps or pins |
| `data-split` / `data-split="load"` | `split-reveal.ts` | Headline lines rise from behind a mask, on scroll or on load |
| `data-parallax="0.2"` | `parallax.ts` | Decorative layer drifts with scroll (768px and up) |
| `<dialog data-morph-dialog>` + `data-morph-open="id"` | `morph-dialog.ts` | Button grows into a modal panel; Esc/backdrop close it faster than it opened |
| `data-loop` (see `LoopGallery.astro`) | `loop-gallery.ts` | Endless photo carousel: drag with inertia, horizontal swipe, arrow keys, buttons; soft blur while moving fast. Never takes over vertical scroll |
| `data-cursor="Drag"` | `cursor-label.ts` | Pointer sticker over drag areas (mouse/trackpad only) |

Rules the modules follow: animate only `transform`, `opacity` and `clip-path`;
entrances ease out, on-screen moves ease in-out, no ease-in; exits are faster than
entrances; hover effects only under `(hover: hover) and (pointer: fine)`.
