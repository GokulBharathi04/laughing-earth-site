// [data-parallax="0.15"]: decorative layers drift slower than the page.
// Transform only, scrubbed to scroll, desktop/tablet only, off for reduced motion.
import { gsap } from './gsap';

export function init() {
  const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]');
  if (!layers.length) return;

  gsap.matchMedia().add(`(min-width: 768px) and (prefers-reduced-motion: no-preference)`, () => {
    layers.forEach((el) => {
      const depth = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(
        el,
        { yPercent: -depth * 50 },
        {
          yPercent: depth * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8, // catch up over 0.8s instead of locking to the scrollbar
          },
        },
      );
    });
  });
}
