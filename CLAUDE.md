# Laughing Earth website — project instructions

This is a static website for Laughing Earth (Chennai), built by Pick your Pixel.

- `BRIEF.md` is the source of truth for structure, design tokens, themes, content and technical rules. Read it before any work and follow it exactly.
- `reference/mockup.png` is the visual style reference. Match its feel (earthy greens and browns, layered leaves, rounded panels, soft shadows, serif headlines), not its placeholder text.
- The build is split into phases, run as slash commands: `/phase1`, `/phase2`, `/phase3`, `/phase4`, plus `/polish [page]` for refinement. Only do the phase you were asked for.

## Non-negotiable rules

- Static site only: Astro with static output. No backend, cart, login or payments.
- Two themes via `data-theme`: `landscaping` = muddy brown and beige; `gifts` = green. Components use CSS variables only, never hard-coded colours.
- Body text 16px minimum and WCAG AA contrast on every background.
- No `maximum-scale` in the viewport meta. Respect `prefers-reduced-motion`. No scroll hijacking.
- Placeholder images go in `public/images/` with descriptive filenames; list every one in `IMAGES-NEEDED.md` with its purpose and ideal size.
- WhatsApp links use `https://wa.me/918668196940?text=` with a URL-encoded, pre-filled message.
- After each phase: run the dev server, check pages at 375px, 768px and 1440px, fix issues, then summarise what was built and what I should review.
