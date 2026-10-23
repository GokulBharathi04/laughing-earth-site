# Start here

Ready-to-run Claude Code project for the Laughing Earth static website.

## What's inside

- `CLAUDE.md` — project rules; Claude Code loads this automatically
- `BRIEF.md` — full design and content brief (source of truth)
- `reference/mockup.png` — visual style reference
- `.claude/commands/` — the build phases as slash commands

## How to run

1. Install Node.js 18 or newer.
2. Unzip this folder and open a terminal inside it:
   `cd laughing-earth-site`
3. Start Claude Code:
   `claude`
4. Run the phases one at a time, reviewing the site in your browser after each:
   - `/phase1` — setup, themes, header/footer, split-screen Home
   - `/phase2` — Return Gifts page (green theme, products, WhatsApp quotes)
   - `/phase3` — Landscaping page (brown/beige theme, gallery, enquiry form)
   - `/phase4` — About, Contact, SEO, redirects, performance, DEPLOY.md
5. Use `/polish /return-gifts` (or any page) whenever something doesn't feel premium yet.

## Before launch

- Replace placeholder images listed in `IMAGES-NEEDED.md`
- Fill the Formspree and GA4 IDs
- Add the client's landscaping services, prices and reviews
- Follow `DEPLOY.md` (created in Phase 4)
