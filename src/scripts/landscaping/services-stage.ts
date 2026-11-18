// Banner → services hand-over, built by the chapter engine (motion only).
//
// The services section is lifted to sit exactly over the banner, and both are
// pinned for the same stretch of scroll. Nothing slides past: the dusk fades in
// over the banner film (a dissolve) while the ring rises into the middle of the
// same screen, so the banner turns into the ring in one continuous movement.
// (Until Nov 2026 a large "Our services" title had its own beat in between; the
// client asked for it to go.) After the stretch, both let go together and the
// page scrolls on. With reduced motion this never runs and the section simply
// follows the banner.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Where in the stretch the ring is fully in place; links to #services land here. */
const RING_SETTLED = 0.68;

export function buildServicesStage(): gsap.Context | null {
  const hero = document.querySelector<HTMLElement>('.hero');
  const sec = document.querySelector<HTMLElement>('[data-svc-stage]');
  if (!hero || !sec) return null;

  const heroVideo = hero.querySelector<HTMLVideoElement>('video');
  // One beat instead of two, so a shorter stretch: about a screen and a half
  // of scrolling from banner to ring, a little more on wide screens.
  const stretch = () => innerHeight * (innerWidth < 801 ? 1.3 : 1.6);

  return gsap.context(() => {
    document.documentElement.classList.add('svc-staged');
    gsap.set(sec, { marginTop: -hero.offsetHeight });

    const bg = sec.querySelector('.svc-bg');
    const ring = sec.querySelector('.svc-ring');

    // Positions are scroll progress through the stretch, so eases shape the
    // mapping from scroll to movement rather than time. The ring starts rising
    // once the banner's words have mostly drifted off (their own exit, in
    // chapters.ts, runs over the first 40% of the banner) and while the dusk is
    // still settling, so the screen is never empty and never crowded; it lands
    // (power3.out: quick, then a long soft settle) just after the dusk is
    // complete, then holds before the page moves on.
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.44, ease: 'power1.inOut' }, 0)
      .fromTo(ring, { autoAlpha: 0, y: 140, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.44, ease: 'power3.out' }, 0.24)
      .to({}, { duration: 0.32 }, 0.68); // the ring holds in the middle before the page moves on

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
        const now = st.progress > 0.44;
        if (now === covered || !heroVideo) return;
        covered = now;
        if (covered) heroVideo.pause();
        else if (!heroVideo.dataset.userPaused) heroVideo.play().catch(() => {});
      },
    });
  });
}
