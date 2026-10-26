// Glass layer for the Landscaping page:
//
//   [data-glass-pop]   panels and pictures rise and settle into place as they
//                      enter (transform + opacity only, staggered 80ms, once)
//   [data-drift]       a picture settles inside its frame as it scrolls past
//
// Everything is skipped for reduced motion; content is visible without JS
// because the hidden state is only ever set by GSAP.
import { gsap, ScrollTrigger } from './gsap';

export function init() {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    pop();
    drift();
  });
}

function pop() {
  const items = gsap.utils.toArray<HTMLElement>('[data-glass-pop]');
  if (!items.length) return;
  gsap.set(items, { y: 56, scale: 0.94, autoAlpha: 0, transformOrigin: '50% 100%' });

  // Reveal on any crossing, not only on enter: a fast scroll or an anchor jump
  // (Plan my garden -> #visit) skips past panels, which must never stay hidden.
  const shown = new WeakSet<Element>();
  const reveal = (batch: Element[]) => {
    const fresh = batch.filter((el) => !shown.has(el));
    if (!fresh.length) return;
    fresh.forEach((el) => shown.add(el));
    gsap.to(fresh, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      overwrite: true,
      clearProps: 'transform',
    });
  };
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    onEnter: reveal,
    onLeave: reveal,
    onEnterBack: reveal,
  });
}

function drift() {
  gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((frame) => {
    const media = frame.querySelector('img, video');
    if (!media) return;
    gsap.fromTo(
      media,
      { scale: 1.12, yPercent: -4 },
      {
        scale: 1,
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      },
    );
  });
}

