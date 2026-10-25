// Background videos ([data-video]) play only while visible, pause off screen,
// and stay on their poster for reduced motion. A [data-video-toggle] button
// (aria-pressed) lets visitors pause the hero video: anything moving for more
// than 5 seconds needs a pause control (WCAG 2.2.2).
import { prefersReducedMotion } from './gsap';

export function init() {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-video]'));
  if (!videos.length) return;

  const paused = new WeakSet<HTMLVideoElement>(); // paused by the visitor

  const play = (video: HTMLVideoElement) => {
    if (prefersReducedMotion() || paused.has(video) || video.dataset.managed === 'gallery') return;
    if (video.preload === 'none') video.preload = 'auto';
    video.play().catch(() => {
      /* autoplay refused (e.g. data saver): the poster stays, which is fine */
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) play(video);
        else video.pause();
      });
    },
    { rootMargin: '200px 0px' },
  );
  videos.forEach((v) => io.observe(v));

  document.querySelectorAll<HTMLButtonElement>('[data-video-toggle]').forEach((button) => {
    const video = document.getElementById(button.getAttribute('aria-controls') ?? '') as HTMLVideoElement | null;
    if (!video) return;
    if (prefersReducedMotion()) button.setAttribute('aria-pressed', 'true');

    button.addEventListener('click', () => {
      const pause = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(pause));
      if (pause) {
        paused.add(video);
        video.pause();
      } else {
        paused.delete(video);
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(() => {});
      }
    });
  });
}
