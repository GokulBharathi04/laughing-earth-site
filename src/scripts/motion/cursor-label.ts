// A small sticker that follows the pointer over [data-cursor="Drag"] areas and
// tilts toward the direction of travel. Mouse/trackpad only, transform only.
import { gsap, CONDITIONS } from './gsap';

export function init() {
  const zones = gsap.utils.toArray<HTMLElement>('[data-cursor]');
  if (!zones.length) return;

  gsap.matchMedia().add(`${CONDITIONS.pointer} and (prefers-reduced-motion: no-preference)`, () => {
    const label = document.createElement('div');
    label.className = 'cursor-label';
    label.setAttribute('aria-hidden', 'true');
    document.body.append(label);
    gsap.set(label, { xPercent: -50, yPercent: -50, scale: 0.9, opacity: 0 });

    const xTo = gsap.quickTo(label, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(label, 'y', { duration: 0.5, ease: 'power3' });
    const rTo = gsap.quickTo(label, 'rotation', { duration: 0.5, ease: 'power3' });

    const move = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      rTo(((event.clientX / window.innerWidth) * 2 - 1) * 12);
    };

    const cleanups = zones.map((zone) => {
      const enter = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        label.textContent = zone.dataset.cursor ?? '';
        gsap.set(label, { x: event.clientX, y: event.clientY });
        gsap.to(label, { scale: 1, opacity: 1, duration: 0.24, ease: 'back.out(1.4)', overwrite: 'auto' });
        zone.addEventListener('pointermove', move);
      };
      const leave = () => {
        gsap.to(label, { scale: 0.9, opacity: 0, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
        zone.removeEventListener('pointermove', move);
      };
      zone.addEventListener('pointerenter', enter);
      zone.addEventListener('pointerleave', leave);
      return () => {
        zone.removeEventListener('pointerenter', enter);
        zone.removeEventListener('pointerleave', leave);
        zone.removeEventListener('pointermove', move);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      label.remove();
    };
  });
}
