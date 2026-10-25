// Category filter for the product catalogue. Cards glide to their new places
// with GSAP Flip; new arrivals fade up. The choice is kept in ?category= so a
// filtered view can be shared. Category cards higher up reuse the same filter.
import { gsap, Flip, ScrollTrigger, prefersReducedMotion } from '../motion/gsap';

export function init() {
  const root = document.querySelector<HTMLElement>('[data-catalogue]');
  if (!root) return;

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-category]'));
  const status = root.querySelector<HTMLElement>('[data-catalogue-status]');
  const valid = new Set(buttons.map((b) => b.dataset.filter));

  function apply(slug: string, animate = true) {
    if (!valid.has(slug)) slug = 'all';
    const state = Flip.getState(cards);

    let shown = 0;
    cards.forEach((card) => {
      const match = slug === 'all' || card.dataset.category === slug;
      card.hidden = !match;
      if (match) shown += 1;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === slug)));
    if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'gift' : 'gifts'}`;

    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    history.replaceState(null, '', url);

    // The page got shorter or taller: re-measure scroll-linked animations below.
    if (!animate || prefersReducedMotion()) return void ScrollTrigger.refresh();
    Flip.from(state, {
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => ScrollTrigger.refresh(),
      onEnter: (entering) =>
        gsap.fromTo(
          entering,
          { opacity: 0, y: 12, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out', delay: 0.08 },
        ),
    });
  }

  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter ?? 'all')));

  document.querySelectorAll<HTMLElement>('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => apply(link.dataset.filterLink ?? 'all'));
  });

  apply(new URL(window.location.href).searchParams.get('category') ?? 'all', false);
}
