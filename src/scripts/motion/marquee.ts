// [data-marquee]: an endless strip of words. It drifts on its own and speeds
// up (or reverses) with scroll velocity, then eases back: the page feels alive
// without taking control of anything. Static under reduced motion.
import { gsap, ScrollTrigger } from './gsap';

export function init() {
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((strip) => {
    const track = strip.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      // The track holds the content twice, so moving it by -50% loops seamlessly.
      const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
      const boost = { value: 1 };
      let settle: gsap.core.Tween | undefined;

      const st = ScrollTrigger.create({
        onUpdate(self) {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
          boost.value = Math.abs(v) < 1 ? Math.sign(v || 1) : v;
          loop.timeScale(boost.value);
          settle?.kill();
          settle = gsap.to(boost, {
            value: Math.sign(boost.value),
            duration: 0.8,
            ease: 'power2.out',
            onUpdate: () => loop.timeScale(boost.value),
          });
        },
      });

      return () => {
        st.kill();
        settle?.kill();
        loop.kill();
        gsap.set(track, { clearProps: 'all' });
      };
    });
  });
}
