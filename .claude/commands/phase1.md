---
description: Phase 1 — project setup, design tokens, two themes, shared components and the split-screen Home page
---

Phase 1 only. Read BRIEF.md and CLAUDE.md fully first, and look at reference/mockup.png.

1. Set up an Astro project with static output in this folder (keep BRIEF.md, CLAUDE.md, reference/ and .claude/ intact). Create a design-token file of CSS custom properties with the exact colours, fonts, radius, shadow and spacing from BRIEF.md. Load Fraunces and Inter from Google Fonts.
2. Set up the two section themes as CSS variable sets switched by a `data-theme` attribute:
   - `data-theme="landscaping"`: muddy brown and beige — beige/cream backgrounds, warm tan accents, chocolate brown deep sections and CTA, ink text on beige, cream text on brown.
   - `data-theme="gifts"`: green, as in the mockup — forest green and teal backgrounds, sage cards, cream headings, peach CTA.
   Components must read colours only from these variables.
3. Build shared components: sticky header with a Landscaping / Return Gifts switch, footer (links, Instagram, policy links, current-year copyright, "Designed & Developed by Pick your Pixel"), floating WhatsApp button, pill buttons, section and card components. All inherit the page theme.
4. Build the Home page as a full-screen split chooser:
   - Left half: Landscaping, brown/beige theme. Right half: Return Gifts, green theme. Logo centred over the split with the tagline "Gardens that grow. Gifts that grow."
   - Desktop: hovering a half expands it to ~65% width over 600ms ease-out and puts a 40% dark overlay on the other. Clicking navigates to /landscaping or /return-gifts with a smooth transition.
   - Mobile (under 768px): halves stack vertically, each tappable, no hover dependency.
   - Keyboard accessible with visible focus; respects prefers-reduced-motion.
   - Placeholder images in public/images/ with clear filenames; start IMAGES-NEEDED.md.
5. Create placeholder routes for /landscaping, /return-gifts, /about and /contact so navigation works, with the right data-theme on each, but do not build their content yet.

When done, run the dev server, check Home at 375px, 768px and 1440px, fix layout issues, and tell me what to review.
