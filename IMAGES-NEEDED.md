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

### Return Gifts page (Phase 2)

All are illustrated stand-ins labelled "Placeholder", generated to match the palette.
Each has a full-size file plus a smaller variant (`-400` for products, `-600` for the rest).

| File | Where it's used | What it should show | Ideal size |
| --- | --- | --- | --- |
| `product-succulent-ceramic-pot-jute.webp` (+ `-400`) | Catalogue card | Succulent in ceramic pot with jute wrap | 800 × 800 px square, under 90 KB |
| `product-succulent-plastic-pot-jute.webp` (+ `-400`) | Catalogue card | Succulent in plastic pot with jute wrap | 800 × 800 px |
| `product-jade-plant-jute.webp` (+ `-400`) | Catalogue card | Jade plant with jute wrap | 800 × 800 px |
| `product-sapling-paper-bag-thank-you-card.webp` (+ `-400`) | Catalogue card | Sapling in paper bag with the thank-you card visible | 800 × 800 px |
| `product-sapling-eco-customised-bag.webp` (+ `-400`) | Catalogue card | Sapling in a customised eco bag, print visible | 800 × 800 px |
| `product-thamboolam-bag-8-8x6x3.webp` (+ `-400`) | Catalogue card | Thamboolam bag 8.8×6×3, front-on | 800 × 800 px |
| `product-thamboolam-bag-8-8x10-5x3.webp` (+ `-400`) | Catalogue card | Thamboolam bag 8.8×10.5×3 | 800 × 800 px |
| `product-thamboolam-bag-10-5x12x4.webp` (+ `-400`) | Catalogue card | Thamboolam bag 10.5×12×4 | 800 × 800 px |
| `product-thamboolam-bag-12x14x4.webp` (+ `-400`) | Catalogue card | Thamboolam bag 12×14×4 | 800 × 800 px |
| `product-aesthetic-seed-paper-wedding-card.webp` (+ `-400`) | Catalogue card | Seed-paper wedding card, seeds visible in the paper | 800 × 800 px |

### Videos (Return Gifts page)

These are **stock clips from Mixkit** (free licence, commercial website use allowed), standing in
until Laughing Earth's own footage arrives. Each video has a `-720.mp4` (tablet/desktop) and
`-360.mp4` (phone) file in `public/videos/`, plus a poster frame `poster-<name>.webp` in
`public/images/` that shows while loading and for visitors who prefer reduced motion.
Replace with the client's footage using the same names: 8–12 s seamless loops, no audio,
1280×720 H.264 under 3 MB, plus a 640×360 version under 800 KB.

| Name | Where it's used | Stock clip now (Mixkit #) | Ideal replacement |
| --- | --- | --- | --- |
| `gifts-hero-watering-plant` | Return Gifts hero background | Hand watering a small plant (#33422) | Hands arranging Laughing Earth return gifts, or watering saplings at the nursery |
| `gifts-band-planting-seedling` | "From a seed to a smile" band | Planting a seedling (#46092) | A guest planting a Laughing Earth sapling / seed-paper card |
| `gallery-wedding-table` | Event gallery: Weddings | Decorated wedding table (#5224) | Thamboolam bags at a real wedding |
| `gallery-gifts-at-the-door` | Event gallery: Housewarmings | Neighbours arriving with gifts (#4725) | Saplings handed out at a housewarming |
| `gallery-giving-a-gift` | Event gallery: Birthdays & thank-yous | Handing over a gift (#14839) | A guest receiving a seeded gift |
| `gallery-succulent-closeup` | Event gallery: Plants that last | Succulent macro (#1892) | Close-up of a jute-wrapped succulent |
| `gallery-planting-seeds` | Event gallery: Seeds that sprout | Planting seeds (#47080) | Seed-paper card being planted |
| `gallery-flower-shop` | Event gallery: Made to order | Flower shop shelves (#4742) | The Laughing Earth workspace / packing gifts |

Before launch, check each stock clip's page on mixkit.co for its current licence terms.

## Logo

The logo is currently a placeholder (a sprout mark plus a "Laughing Earth"
wordmark) in `src/components/Logo.astro`, with a matching `public/favicon.svg`.

Needed from the client: the final logo as **SVG** (preferred) or a transparent
PNG at least 1000 px wide, in versions for light and dark backgrounds, plus a
square icon for the favicon (512 × 512 px).

### Landscaping page (Phase 3, stone and paving restyle)

The page is built around stone paving and stonework. **None of these pictures is
Laughing Earth's own work.** They are openly licensed photographs of paving from
Wikimedia Commons and Openverse, credited in the page footer as their licences
require. CC BY-SA pictures must stay credited, and any edited version must be
shared under the same licence. Each is in `public/images/land/` at 1600 px
(`name.webp`) and 800 px (`name-800.webp`). Credits are generated from
`data/landscaping-credits.json`, so update that file when replacing one.

| File | Where it's used | Source now | Ideal replacement |
| --- | --- | --- | --- |
| `land/patio-steps.webp` (+ `-800`) | Intro, tall photo | Blake Hall Essex south-east face patio 01, Acabashi, CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:Blake_Hall_Essex_south-east_face_patio_01.jpg)) | A finished Laughing Earth terrace with steps down to a lawn |
| `land/stonework-chelsea.webp` (+ `-800`) | Intro, small photo (show-garden stonework) | Sanctuary Garden, Bridgerton Garden - Chelsea Flower Show 2024 - DSC02342, Daderot, CC0 ([source](https://commons.wikimedia.org/wiki/File:Sanctuary_Garden,_Bridgerton_Garden_-_Chelsea_Flower_Show_2024_-_DSC02342.jpg)) | Close-up of the finest stonework Laughing Earth has laid: benches, steps or coping |
| `land/patio-barn.webp` (+ `-800`) | "Sandstone patios" row; visit card background | Blake Hall Essex listed barn patio 02, Acabashi, CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:Blake_Hall_Essex_listed_barn_patio_02.jpg)) | A wide sandstone patio they laid, with the garden around it |
| `land/brick-herringbone.webp` (+ `-800`) | "Brick paths" row | A close-up view of a paved surface featuring multi-toned bricks (brown, grey, and tan) arranged in a distinct herringbone pattern, creating a textured ground covering. Captured from Portland, Bigul Malayi, CC0 ([source](https://wordpress.org/photos/photo/85468af49c/)) | Their herringbone brick path, close up |
| `land/crazy-paving.webp` (+ `-800`) | "Crazy paving" row; chooser panel (paving-only crop `-panel`) | Bluestone Flagstone - Stone Paver Pathway & Patio Entry - Buechel Stone, Shelterpro, CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:Bluestone_Flagstone_-_Stone_Paver_Pathway_%26_Patio_Entry_-_Buechel_Stone.jpg)) | Their crazy paving or stepping stones |
| `land/granite-setts.webp` (+ `-800`) | "Granite drives" row; chooser panel (`-panel` crop) | Granite setts - geograph.org.uk - 4997354, Bill Harrison, CC BY-SA 2.0 ([source](https://commons.wikimedia.org/wiki/File:Granite_setts_-_geograph.org.uk_-_4997354.jpg)) | A granite-sett driveway they laid |
| `land/temple-granite.webp` (+ `-800`) | "Steps, walls and edging" row | "The Stone Construction Method of The Big Temple", Thamizhpparithi Maari, CC BY-SA 3.0 ([source](https://commons.wikimedia.org/wiki/File:%22The_Stone_Construction_Method_of_The_Big_Temple%22.JPG)) | Their stone steps or retaining wall |
| `land/flag-planting.webp` (+ `-800`) | "Lawns and planting" row | Potentilla nana around flagstone patio (19902497671), Patrick Standish from Aurora, Colorado, USA, CC BY 2.0 ([source](https://commons.wikimedia.org/wiki/File:Potentilla_nana_around_flagstone_patio_(19902497671).jpg)) | Planting softening the edge of their paving |
| `land/brick-moss.webp` (+ `-800`) | Chooser panel: Clay brick paviours | "Catskill" Paving Stones, Prospect Park, EPiCphotos (Eileen P. Collins), CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:%22Catskill%22_Paving_Stones,_Prospect_Park.jpg)) | Close-up of the clay paviours they stock |
| `land/sandstone-wet.webp` (+ `-800`) | Chooser panel: Indian sandstone (`-panel` crop); Questions, square photo | Wet Paving Stones, Dominic's pics, CC BY 2.0 ([source](https://www.flickr.com/photos/64097751@N00/52618753951)) | The Indian sandstone they stock, wet |
| `land/kota-slabs.webp` (+ `-800`) | Process step 1 ("On the first visit") | Kota stone Rough 9252041982, Naksh stone, CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:Kota_stone_Rough_9252041982.jpg)) | Stone samples laid out on a client site |
| `land/pavers-study.webp` (+ `-800`) | Process step 2 ("Then a drawing"), a 1914 drawing by Umberto Boccioni | Study for "The Street Pavers": Man Laying Paving Stones, Umberto Boccioni, CC0 ([source](https://commons.wikimedia.org/wiki/File:Study_for_%22The_Street_Pavers%22-_Man_Laying_Paving_Stones_MET_DP-1569-001.jpg)) | One of their own garden plans |
| `land/setts-laying.webp` (+ `-800`) | Process step 3 ("On site") | Placing the new granite setts - geograph.org.uk - 3506618, John Haynes, CC BY-SA 2.0 ([source](https://commons.wikimedia.org/wiki/File:Placing_the_new_granite_setts_-_geograph.org.uk_-_3506618.jpg)) | Their team laying paving |
| `land/path-hedge.webp` (+ `-800`) | Questions, tall photo | Garden path Harlow Museum & Walled Gardens, Essex 02, Acabashi, CC BY-SA 4.0 ([source](https://commons.wikimedia.org/wiki/File:Garden_path_Harlow_Museum_%26_Walled_Gardens,_Essex_02.jpg)) | A path they laid through a garden |

Videos (Mixkit free licence, 1280×720 and 640×360 H.264, no audio, with a
poster `poster-<name>.webp` in `public/images/`):

| Name | Where it's used | Stock clip now (Mixkit #) | Ideal replacement |
| --- | --- | --- | --- |
| `land-hero-stone-wall` | Hero background (16 s loop) | Stone retaining wall and steps below a lawn (#15318) | Slow pass along a wall, steps or patio Laughing Earth built |
| `land-rain-stones` | Monsoon curtain, frame 1 | Rain on smooth stones (#21194) | Rain running off one of their patios |
| `land-pebble-path` | Monsoon curtain, frame 2 | Pebbles close up (#20299) | A pebble drainage channel they laid |
| `land-stone-water` | Monsoon curtain, frame 3 | Water over stones (#17943) | A stone-edged pond or water feature they built |
| `land-slab-cut` | Process step 4 | A slab cut on a saw (#46079) | Their team cutting stone on site |
| `land-hero-villa-garden` | Hero background (17 s loop, version 3) | Villa garden with lawn and pool (#47286) | A slow pass over a garden Laughing Earth built |
| `land-story-gardener-soil` | Intro, tall video | Gloved hands planting (#43697) | The team planting on a real site |
| `land-band-lawn-mowing` | "A garden is never finished" band | Trimmer edging a lawn (#47172) | A maintenance visit: mowing, edging, pruning |
| `gallery-land-sprinkler-lawn` | "Lawn setup" row (still) and the "Sun and monsoon" curtain | Lawn sprinkler (#19551) | A finished lawn with its irrigation running |
| `gallery-land-garden-stream` | "Garden design" row (still) | Stone stream with flowers (#18741) | A garden they designed |
| `gallery-land-watering-garden` | "Vertical gardens" row (still) | Watering potted plants (#10479) | A vertical or balcony garden by Laughing Earth |
| `gallery-land-nursery` | "Terrace gardens" row (still) | Hanging baskets in a nursery (#43696) | A terrace garden they planted |
| `gallery-land-garden-sunset` | "Garden maintenance" row (still) | Garden at sunset (#4205) | A well-kept client garden |

The paving drawing in "Choose your paving" is generated in code
(`src/lib/paving-patterns.ts`) and needs no images.

**Before/after slider: must be replaced before launch.**
`landscaping-sample-before.webp` and `landscaping-sample-after.webp` (+ `-640`)
are one frame of the hero clip, with the "before" colour-graded to look bare.
They show the slider working and are badged "Sample images" on the page. They
are not a real before/after. Needed: one real pair from the **same camera
position**, before work and after planting, at 1280 × 720 px (16:9), under
150 KB each. Then remove `sample` from `<BeforeAfter>` in
`src/pages/landscaping.astro`.
