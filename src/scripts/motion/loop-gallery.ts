// Endless gallery carousel, after the "Selected" wheel on artemshcherban.com,
// rebuilt without scroll hijacking: it moves by drag (with inertia), horizontal
// trackpad swipes, arrow keys and Prev/Next buttons. Vertical wheel always
// scrolls the page.
//
// One number drives everything: `pos`, the fractional index at the centre.
// Each frame eases `pos` toward `target`; every slide's x / scale / opacity is
// derived from its distance to `pos`, and scroll speed adds a soft blur.
//
// Without JS, or with reduced motion, the markup stays a native scroll-snap row.
import { gsap, Draggable, CONDITIONS, debounce } from './gsap';

const EASING = 9; // per second; higher = snappier follow
const MAX_BLUR = 8; // px

export function init() {
  document.querySelectorAll<HTMLElement>('[data-loop]').forEach(setup);
}

function setup(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('[data-loop-stage]');
  const track = root.querySelector<HTMLElement>('[data-loop-track]');
  const items = gsap.utils.toArray<HTMLElement>('[data-loop-item]', root);
  const caption = root.querySelector<HTMLElement>('[data-loop-caption]');
  const counter = root.querySelector<HTMLElement>('[data-loop-counter]');
  const bar = root.querySelector<HTMLElement>('[data-loop-progress]');
  if (!stage || !track || items.length < 3) return;

  const n = items.length;
  const wrap = gsap.utils.wrap(-n / 2, n / 2);
  const mod = gsap.utils.wrap(0, n);

  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('is-live');

    let pos = 0;
    let target = 0;
    let spacing = 0;
    let dragging = false;
    let active = -1;
    let lastTime = 0;
    let lastPos = 0;
    let blur = 0;
    let inView = false;

    const setters = items.map((el) => ({
      x: gsap.quickSetter(el, 'x', 'px'),
      scale: gsap.quickSetter(el, 'scale'),
      opacity: gsap.quickSetter(el, 'opacity'),
    }));
    const captionFade = caption ? gsap.quickTo(caption, 'opacity', { duration: 0.3, ease: 'power2.out' }) : null;

    const measure = () => {
      spacing = items[0].offsetWidth * (window.matchMedia(CONDITIONS.mobile).matches ? 1.06 : 1.1);
    };
    measure();

    function setActive(index: number) {
      if (index === active) return;
      active = index;
      items.forEach((el, i) => {
        const isActive = i === index;
        el.classList.toggle('is-active', isActive);
        el.setAttribute('aria-hidden', String(!isActive));
        // Only the centre slide's video plays; the others rest on their poster.
        const video = el.querySelector('video');
        if (!video) return;
        if (isActive && inView) {
          video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
      const label = items[index].dataset.caption ?? '';
      if (caption) caption.textContent = label;
      if (counter) counter.textContent = `${index + 1} / ${n}`;
    }

    function render(time: number) {
      const dt = lastTime ? Math.min(0.05, time - lastTime) : 1 / 60;
      lastTime = time;

      if (!dragging) {
        pos += (target - pos) * (1 - Math.exp(-dt * EASING));
        if (Math.abs(target - pos) < 0.0005) pos = target;
      }

      items.forEach((_, i) => {
        const offset = wrap(i - pos);
        const dist = Math.abs(offset);
        // fade out before a slide wraps to the other side, so it never pops
        const edge = gsap.utils.clamp(0, 1, (n / 2 - dist) * 1.5);
        setters[i].x(offset * spacing);
        setters[i].scale(1 - 0.1 * Math.min(1, dist));
        setters[i].opacity((1 - 0.45 * Math.min(1, dist)) * edge);
      });

      // Speed in slides per second → blur on the track, fade on the caption.
      const speed = Math.abs(pos - lastPos) / dt;
      lastPos = pos;
      const nextBlur = Math.round(gsap.utils.clamp(0, MAX_BLUR, (speed - 1.5) * 2) * 2) / 2;
      if (nextBlur !== blur) {
        blur = nextBlur;
        track!.style.filter = blur ? `blur(${blur}px)` : '';
      }
      captionFade?.(1 - gsap.utils.clamp(0, 1, (speed - 1) / 3));

      if (bar) gsap.set(bar, { xPercent: mod(pos) * 100 });
      setActive(Math.round(mod(Math.round(pos))) % n);
    }

    const tick = () => render(gsap.ticker.time);
    // Only run the frame loop while the gallery is on screen. An observer
    // (not a ScrollTrigger) so layout shifts above can't leave it stale.
    const activeVideo = () => items[active]?.querySelector('video');
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        gsap.ticker.add(tick);
        activeVideo()?.play().catch(() => {});
        autoplay.restart(true);
      } else {
        gsap.ticker.remove(tick);
        activeVideo()?.pause();
        autoplay.pause();
      }
    });

    // Advance every 5s while visible and untouched: hover, focus, drag or a
    // hidden tab hold it; any manual move restarts the wait.
    let held = false;
    const autoplay = gsap.delayedCall(5, () => {
      if (inView && !held && !dragging && !document.hidden) target = Math.round(target) + 1;
      autoplay.restart(true);
    }).pause();
    const hold = (on: boolean) => () => {
      held = on;
      if (!on) autoplay.restart(true);
    };
    const holdOn = hold(true);
    const holdOff = hold(false);
    root.addEventListener('pointerenter', holdOn);
    root.addEventListener('pointerleave', holdOff);
    root.addEventListener('focusin', holdOn);
    root.addEventListener('focusout', holdOff);

    visibility.observe(root);
    render(0);

    const go = (step: number) => {
      target = Math.round(target) + step;
      autoplay.restart(true);
    };

    // Buttons and keys
    const prev = root.querySelector('[data-loop-prev]');
    const next = root.querySelector('[data-loop-next]');
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1);
      else if (event.key === 'ArrowRight') go(1);
      else return;
      event.preventDefault();
    };
    stage.addEventListener('keydown', onKey);

    // Horizontal trackpad swipes only; vertical wheel is left to the page.
    let settle: number | undefined;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      target += event.deltaX / spacing;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => (target = Math.round(target)), 120);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });

    // Drag with inertia, landing exactly on a slide.
    const proxy = document.createElement('div');
    let startX = 0;
    let startTarget = 0;
    const follow = (x: number) => {
      target = startTarget - (x - startX) / spacing;
      pos = target;
    };

    const [drag] = Draggable.create(proxy, {
      type: 'x',
      trigger: stage,
      inertia: true,
      allowContextMenu: true,
      minimumMovement: 6,
      onPress() {
        startX = this.x;
        startTarget = pos;
        target = pos;
      },
      onDragStart() {
        dragging = true;
        root.classList.add('is-dragging');
      },
      onDrag() {
        follow(this.x);
      },
      onThrowUpdate() {
        follow(this.x);
      },
      onRelease() {
        dragging = false;
        root.classList.remove('is-dragging');
      },
      onThrowComplete() {
        target = Math.round(target);
      },
      snap: {
        x: (x: number) => startX - (Math.round(startTarget - (x - startX) / spacing) - startTarget) * spacing,
      },
      onClick(event: PointerEvent) {
        // Tapping a side slide brings it to the centre.
        const item = (event.target as HTMLElement).closest<HTMLElement>('[data-loop-item]');
        if (!item) return;
        const index = items.indexOf(item);
        if (index !== active) target = Math.round(pos) + wrap(index - Math.round(pos));
      },
    });

    const onResize = debounce(measure, 50);
    window.addEventListener('resize', onResize);

    return () => {
      root.classList.remove('is-live', 'is-dragging');
      gsap.ticker.remove(tick);
      visibility.disconnect();
      autoplay.kill();
      root.removeEventListener('pointerenter', holdOn);
      root.removeEventListener('pointerleave', holdOff);
      root.removeEventListener('focusin', holdOn);
      root.removeEventListener('focusout', holdOff);
      items.forEach((el) => el.querySelector('video')?.pause());
      drag.kill();
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      stage.removeEventListener('keydown', onKey);
      stage.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      track.style.filter = '';
      items.forEach((el) => el.removeAttribute('aria-hidden'));
      gsap.set(items, { clearProps: 'all' });
    };
  });
}
