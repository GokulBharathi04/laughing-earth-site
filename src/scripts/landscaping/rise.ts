// One-way reveal for the flowing sections below the services ring (about,
// vision, contact). Unlike the chapter engine's scrubbed entrance-and-exit, an
// element rises once and stays, because these sections can be taller than the
// screen and must never fade while someone is still reading them.
// Content is only hidden once this script runs, so it shows without JavaScript.
export function init() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-rise]'));
  if (!items.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('rise-ready');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((el) => io.observe(el));
}
