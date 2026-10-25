// Paving layouts for the "Choose your paving" drawing, computed at build time
// into plain SVG rectangles. Each unit carries a shade index (0–2) so the
// drawing can colour it from the chosen material's three tones.

export type Unit = { x: number; y: number; w: number; h: number; shade: number };
export type Pattern = 'herringbone' | 'basketweave' | 'running-bond' | 'random-flags';

export const VIEW = { w: 480, h: 300 };

// Small deterministic generator so every build draws the same path.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const visible = (u: Unit) => u.x < VIEW.w && u.y < VIEW.h && u.x + u.w > 0 && u.y + u.h > 0;

function shaded(units: Omit<Unit, 'shade'>[], seed: number): Unit[] {
  const r = rng(seed);
  return units.map((u) => ({ ...u, shade: Math.floor(r() * 3) })).filter(visible);
}

/** 90° herringbone: bricks of 2u × u in diagonal chains (checked for no gaps or overlaps). */
function herringbone(u = 22): Unit[] {
  const out: Omit<Unit, 'shade'>[] = [];
  const span = Math.ceil((VIEW.w + VIEW.h) / u) + 4;
  for (let c = -span; c <= span; c++) {
    for (let k = -span; k <= span; k++) {
      const ox = 2 * c;
      const oy = -2 * c;
      out.push({ x: (k + ox) * u, y: (k + oy) * u, w: 2 * u, h: u });
      out.push({ x: (k + 2 + ox) * u, y: (k - 1 + oy) * u, w: u, h: 2 * u });
    }
  }
  return shaded(out, 7);
}

/** Basketweave: 2u squares alternating a pair of horizontal and a pair of vertical bricks. */
function basketweave(u = 24): Unit[] {
  const out: Omit<Unit, 'shade'>[] = [];
  for (let row = 0; row * 2 * u < VIEW.h; row++) {
    for (let col = 0; col * 2 * u < VIEW.w; col++) {
      const x = col * 2 * u;
      const y = row * 2 * u;
      if ((row + col) % 2 === 0) {
        out.push({ x, y, w: 2 * u, h: u }, { x, y: y + u, w: 2 * u, h: u });
      } else {
        out.push({ x, y, w: u, h: 2 * u }, { x: x + u, y, w: u, h: 2 * u });
      }
    }
  }
  return shaded(out, 11);
}

/** Running (stretcher) bond: courses of long bricks, every other course offset by half. */
function runningBond(w = 64, h = 22): Unit[] {
  const out: Omit<Unit, 'shade'>[] = [];
  for (let row = 0; row * h < VIEW.h; row++) {
    const offset = row % 2 ? -w / 2 : 0;
    for (let x = offset; x < VIEW.w; x += w) out.push({ x, y: row * h, w, h });
  }
  return shaded(out, 23);
}

/** Random flags: the area split again and again into slabs of mixed sizes. */
function randomFlags(): Unit[] {
  const r = rng(41);
  const out: Omit<Unit, 'shade'>[] = [];
  const split = (x: number, y: number, w: number, h: number, depth: number) => {
    const small = w < 110 && h < 110;
    if (depth > 4 || small || (depth > 1 && r() < 0.18)) {
      out.push({ x, y, w, h });
      return;
    }
    const vertical = w > h ? r() < 0.8 : r() < 0.2;
    const t = 0.35 + r() * 0.3;
    if (vertical) {
      split(x, y, w * t, h, depth + 1);
      split(x + w * t, y, w * (1 - t), h, depth + 1);
    } else {
      split(x, y, w, h * t, depth + 1);
      split(x, y + h * t, w, h * (1 - t), depth + 1);
    }
  };
  split(0, 0, VIEW.w, VIEW.h, 0);
  return shaded(out, 41);
}

export const PATTERNS: Record<Pattern, { label: string; units: Unit[] }> = {
  herringbone: { label: 'Herringbone', units: herringbone() },
  basketweave: { label: 'Basketweave', units: basketweave() },
  'running-bond': { label: 'Running bond', units: runningBond() },
  'random-flags': { label: 'Random flags', units: randomFlags() },
};
