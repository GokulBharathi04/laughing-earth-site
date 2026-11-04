// Highlight grid (after Vengeance UI's "highlight grid"): one glow glides to sit
// behind whichever cell the pointer or keyboard focus is on. Pure CSS
// transitions on transform and size; the glow is decorative (aria-hidden).
export function init() {
  document.querySelectorAll<HTMLElement>('[data-highlight-grid]').forEach((grid) => {
    const glow = grid.querySelector<HTMLElement>('.hl__glow');
    const cells = Array.from(grid.querySelectorAll<HTMLElement>('.hl__cell'));
    if (!glow || !cells.length) return;

    let current: HTMLElement | null = null;
    const inset = 6;

    const moveTo = (cell: HTMLElement) => {
      current = cell;
      glow.style.transform = `translate(${cell.offsetLeft + inset}px, ${cell.offsetTop + inset}px)`;
      glow.style.width = `${cell.offsetWidth - inset * 2}px`;
      glow.style.height = `${cell.offsetHeight - inset * 2}px`;
      glow.style.opacity = '1';
    };

    cells.forEach((cell) => {
      cell.addEventListener('pointerenter', () => moveTo(cell));
      cell.addEventListener('focusin', () => moveTo(cell));
    });
    grid.addEventListener('pointerleave', () => {
      glow.style.opacity = '0';
      current = null;
    });

    // Keep the glow aligned if the grid reflows (resize, fonts, images)
    new ResizeObserver(() => {
      if (current) moveTo(current);
    }).observe(grid);
  });
}
