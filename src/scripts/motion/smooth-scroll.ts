// Lenis smoothing for mouse-wheel scrolling on desktop pointers only.
// It never takes over scrolling: touch, keyboard and scrollbar stay native,
// nothing is snapped or pinned, and it is off for reduced motion.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, CONDITIONS } from './gsap';

export function init() {
  const mm = gsap.matchMedia();

  mm.add(`${CONDITIONS.pointer} and (prefers-reduced-motion: no-preference)`, () => {
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -96 } });
    const raf = (time: number) => lenis.raf(time * 1000);

    // Modal dialogs pause smoothing so the page behind them stays put.
    const stop = () => lenis.stop();
    const start = () => lenis.start();

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('motion:lock', stop);
    document.addEventListener('motion:unlock', start);

    return () => {
      document.removeEventListener('motion:lock', stop);
      document.removeEventListener('motion:unlock', start);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  });
}
