// Generates the Landscaping page's background: a seamless tile of natural
// flagstone paving (irregular flat slabs, mortar joints, a rustic grain).
//
//   src/assets/land/flagstone-ground.svg
//
// Slabs are the cells of a Voronoi diagram on a torus, relaxed once so the
// sizes stay uneven but not wild. Each cell is clipped by the bisector to its
// neighbours shifted inwards by half a joint, so the mortar is an even width;
// the edges are then roughened a little so the stones look hand-laid. Colour is
// translucent light and shadow only, so the same tile sits on every fern tone.
//
// Run with `node scripts/flagstones.mjs` after changing a setting below.
import { writeFileSync } from 'node:fs';

const SIZE = 720; // tile size in px
const SLABS = 26; // stones per tile
const JOINT = 7; // mortar width in px
const ROUGH = 3.4; // edge roughness in px
const SEED = 11;

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const rand = rng(SEED);

// Sites, plus their eight copies around the tile, so cells wrap seamlessly
let sites = Array.from({ length: SLABS }, () => [rand() * SIZE, rand() * SIZE]);
const copies = (pts) =>
  pts.flatMap(([x, y], i) =>
    [-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => ({ x: x + dx * SIZE, y: y + dy * SIZE, i }))),
  );

/** Keep the part of `poly` on the site's side of the bisector, shifted in by `inset`. */
function clip(poly, [sx, sy], [ox, oy], inset) {
  const nx = ox - sx, ny = oy - sy;
  const len = Math.hypot(nx, ny);
  const ux = nx / len, uy = ny / len;
  const limit = len / 2 - inset; // distance from the site along the normal
  const side = ([px, py]) => (px - sx) * ux + (py - sy) * uy - limit;
  const out = [];
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k], b = poly[(k + 1) % poly.length];
    const da = side(a), db = side(b);
    if (da <= 0) out.push(a);
    if (da * db < 0) {
      const t = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

function cell(site, all, inset) {
  const r = SIZE; // start from a generous square around the site
  let poly = [
    [site[0] - r, site[1] - r],
    [site[0] + r, site[1] - r],
    [site[0] + r, site[1] + r],
    [site[0] - r, site[1] + r],
  ];
  for (const o of all) {
    if (Math.abs(o.x - site[0]) < 1e-6 && Math.abs(o.y - site[1]) < 1e-6) continue;
    if (Math.hypot(o.x - site[0], o.y - site[1]) > SIZE * 0.9) continue;
    poly = clip(poly, site, [o.x, o.y], inset);
    if (poly.length < 3) break;
  }
  return poly;
}

const centroid = (poly) => {
  let a = 0, cx = 0, cy = 0;
  for (let k = 0; k < poly.length; k++) {
    const [x0, y0] = poly[k], [x1, y1] = poly[(k + 1) % poly.length];
    const f = x0 * y1 - x1 * y0;
    a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
  }
  a /= 2;
  return [cx / (6 * a), cy / (6 * a)];
};

// One Lloyd relaxation: clearly uneven sizes, but no slivers
for (let it = 0; it < 1; it++) {
  const all = copies(sites);
  sites = sites.map((s) => {
    const [cx, cy] = centroid(cell(s, all, 0));
    return [((cx % SIZE) + SIZE) % SIZE, ((cy % SIZE) + SIZE) % SIZE];
  });
}

/** Subdivide each edge and nudge the new points: a hand-dressed, uneven edge. */
function roughen(poly) {
  const out = [];
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k], b = poly[(k + 1) % poly.length];
    out.push(a);
    const steps = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 15));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      out.push([a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * ROUGH * 2, a[1] + (b[1] - a[1]) * t + (rand() - 0.5) * ROUGH * 2]);
    }
  }
  return out;
}

const path = (poly, dx, dy) =>
  'M' + poly.map(([x, y]) => `${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`).join('L') + 'Z';

const all = copies(sites);
const slabs = [];
for (const s of sites) {
  const poly = roughen(cell(s, all, JOINT / 2));
  const tone = 0.035 + rand() * 0.045; // each stone a slightly different shade
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  // Draw the stone, plus copies wherever it crosses the tile edge
  for (const dx of [0, -SIZE, SIZE]) {
    for (const dy of [0, -SIZE, SIZE]) {
      if (Math.max(...xs) + dx < 0 || Math.min(...xs) + dx > SIZE) continue;
      if (Math.max(...ys) + dy < 0 || Math.min(...ys) + dy > SIZE) continue;
      slabs.push({ d: path(poly, dx, dy), tone });
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0"/>
</filter>
<mask id="stones"><g fill="#fff">${slabs.map((s) => `<path d="${s.d}"/>`).join('')}</g></mask>
</defs>
<rect width="${SIZE}" height="${SIZE}" fill="#000" fill-opacity="0.13"/>
${slabs.map((s) => `<path d="${s.d}" fill="#d9eadf" fill-opacity="${s.tone.toFixed(3)}" stroke="#fff" stroke-opacity="0.035" stroke-width="1"/>`).join('')}
<rect width="${SIZE}" height="${SIZE}" filter="url(#grain)" mask="url(#stones)"/>
</svg>`;

writeFileSync('src/assets/land/flagstone-ground.svg', svg);
console.log('flagstone-ground.svg', sites.length, 'slabs,', (svg.length / 1024).toFixed(1), 'KB');
