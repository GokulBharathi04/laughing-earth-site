// Scroll choreography beyond the basic fade-and-rise:
//
//   [data-hero-intro]        children marked [data-hero-item] stagger in on load,
//                            and a [data-hero-media] layer opens from a rounded card
//   [data-stagger]           its direct children rise in one after another
//   [data-clip-reveal]       an image wipes up from the bottom while settling from 1.15×
//   [data-pop]               icons pop in once their card is in view
//   [data-sway]              decorative leaves drift gently, forever (transform only)
//   [data-expand]            a media band grows from an inset card to full width as it
//                            scrolls through the viewport (scrubbed, never pinned)
//
// All of it is skipped for reduced motion; content is visible without JS.
import { gsap, ScrollTrigger, EASE } from './gsap';

export function init() {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    heroIntro();
    stagger();
    clipReveal();
    pop();
    sway();
    expand();
  });
}

function heroIntro() {
  document.querySelectorAll<HTMLElement>('[data-hero-intro]').forEach((hero) => {
    const items = hero.querySelectorAll('[data-hero-item]');
    const media = hero.querySelector('[data-hero-media]');
    const tl = gsap.timeline({ defaults: { ease: EASE.outStrong } });

    if (media) {
      tl.fromTo(
        media,
        { clipPath: 'inset(6% 5% 6% 5% round 32px)', scale: 1.12 },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, duration: 1.4, ease: 'expo.out' },
        0,
      );
    }
    tl.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09 }, 0.35);
  });
}

function stagger() {
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    gsap.set(children, { y: 40, opacity: 0 });
    ScrollTrigger.batch(children, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, ease: EASE.out, stagger: 0.08, overwrite: true }),
    });
  });
}

function clipReveal() {
  gsap.utils.toArray<HTMLElement>('[data-clip-reveal]').forEach((el) => {
    const img = el.querySelector('img, video') ?? el;
    gsap.set(el, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(img, { scale: 1.15 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out' });
        gsap.to(img, { scale: 1, duration: 1.4, ease: 'expo.out' });
      },
    });
  });
}

function pop() {
  gsap.utils.toArray<HTMLElement>('[data-pop]').forEach((el) => {
    gsap.from(el, {
      scale: 0.6,
      rotation: -12,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function sway() {
  gsap.utils.toArray<HTMLElement>('[data-sway]').forEach((el, i) => {
    gsap.to(el, {
      rotation: i % 2 ? -4 : 4,
      y: '+=10',
      duration: 4 + (i % 3),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      transformOrigin: '50% 100%',
    });
  });
}

function expand() {
  gsap.utils.toArray<HTMLElement>('[data-expand]').forEach((band) => {
    const media = band.querySelector('[data-expand-media]');
    if (!media) return;
    gsap.fromTo(
      media,
      { clipPath: 'inset(8% 14% 8% 14% round 32px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: band, start: 'top 85%', end: 'center 55%', scrub: 0.6 },
      },
    );
    const inner = media.querySelector('video, img');
    if (inner) {
      gsap.fromTo(
        inner,
        { scale: 1.2 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
      );
    }
  });
}
