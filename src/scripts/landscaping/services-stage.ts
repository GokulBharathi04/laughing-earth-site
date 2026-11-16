// Banner → services hand-over, built by the chapter engine (motion only).
//
// The services section is lifted to sit exactly over the banner, and both are
// pinned for the same stretch of scroll. Nothing slides: the dusk background
// fades in over the banner film (a dissolve), "Our services" settles in large
// in the middle, then gives way to the ring alone. After the stretch, both let
// go together and the page scrolls on. With reduced motion this never runs and
// the section simply follows the banner.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Where in the stretch the ring is fully in place; links to #services land here. */
const RING_SETTLED = 0.82;

export function buildServicesStage(): gsap.Context | null {
  const hero = document.querySelector<HTMLElement>('.hero');
  const sec = document.querySelector<HTMLElement>('[data-svc-stage]');
  if (!hero || !sec) return null;

  const heroVideo = hero.querySelector<HTMLVideoElement>('video');
  const stretch = () => innerHeight * (innerWidth < 801 ? 2 : 2.4);

  return gsap.context(() => {
    document.documentElement.classList.add('svc-staged');
    gsap.set(sec, { marginTop: -hero.offsetHeight });

    const bg = sec.querySelector('.svc-bg');
    const title = sec.querySelector('.svc-title');
    const lede = sec.querySelector('.svc-lede');
    const ring = sec.querySelector('.svc-ring');

    // Positions are scroll progress through the stretch, so eases shape the
    // mapping from scroll to movement rather than time.
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, 0)
      .fromTo(title, { autoAlpha: 0, scale: 1.12, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.26, ease: 'power2.out' }, 0.08)
      .fromTo(lede, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 0.2)
      .to([title, lede], { autoAlpha: 0, y: -60, filter: 'blur(8px)', duration: 0.18, ease: 'power1.inOut', stagger: 0.02 }, 0.46)
      .fromTo(ring, { autoAlpha: 0, y: 90, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: 'power2.out' }, 0.56)
      .to({}, { duration: 0.2 }, 0.8); // the ring holds in the middle before the page moves on

    // The banner stays put underneath while the dusk covers it.
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: () => `+=${stretch()}`, pin: true, pinSpacing: false });

    let covered = false;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: () => `+=${stretch()}`,
      pin: true,
      scrub: 1,
      animation: tl,
      invalidateOnRefresh: true,
      onRefresh: (st) => {
        sec.dataset.anchorScroll = String(Math.round(st.start + (st.end - st.start) * RING_SETTLED));
      },
      // Once the dusk fully covers the film, stop decoding it; resume on the way back.
      onUpdate: (st) => {
        const now = st.progress > 0.34;
        if (now === covered || !heroVideo) return;
        covered = now;
        if (covered) heroVideo.pause();
        else if (!heroVideo.dataset.userPaused) heroVideo.play().catch(() => {});
      },
    });
  });
}
