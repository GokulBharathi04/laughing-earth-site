// Return Gifts page motion and interaction: smoothed scrolling, the hero that stays
// put while the next section slides over it, the pinned statement, pinned left
// columns, a header that follows the section beneath it, line-by-line headings,
// image reveals, the celebrations slider and the menu. The catalogue filter, quote
// dialog and quote message are the existing shared modules.
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from '../motion/gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { init as catalogue } from './catalogue';
import { init as quoteBuilder } from './quote-builder';
import { init as morphDialog } from '../motion/morph-dialog';

gsap.registerPlugin(ScrollSmoother);

const qs = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const qsa = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const PIN_MQ = '(min-width: 901px)';

export function init() {
  const reduced = prefersReducedMotion();
  let smoother: ScrollSmoother | null = null;

  /* ---------- Menu ---------- */
  const menu = qs('[data-menu]')!;
  const toggle = qs<HTMLButtonElement>('[data-menu-toggle]')!;
  const setMenu = (open: boolean) => {
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.toggleAttribute('inert', !open);
    smoother?.paused(open);
    if (open) qs<HTMLElement>('a', menu)?.focus({ preventScroll: true });
    else if (menu.contains(document.activeElement)) toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  qsa('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Videos: only what is on screen plays ---------- */
  const clips = qsa<HTMLVideoElement>('video');
  const shouldPlay = (v: HTMLVideoElement) => !v.dataset.userPaused && (!v.closest('.g-slide') || v.closest('.g-slide')!.classList.contains('on'));
  const syncVideos = () => clips.forEach((v) => (v.dataset.near && shouldPlay(v) ? v.play().catch(() => {}) : v.pause()));
  if (!reduced) {
    const ahead = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && v.preload === 'none' && shouldPlay(v)) {
            v.preload = 'auto';
            v.load();
          }
        }),
      { rootMargin: '100% 0px' },
    );
    const onScreen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          v.dataset.near = e.isIntersecting ? '1' : '';
          if (e.isIntersecting && shouldPlay(v)) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.02 },
    );
    clips.forEach((v) => {
      ahead.observe(v);
      onScreen.observe(v);
    });
  }
  const heroToggle = qs<HTMLButtonElement>('[data-video-toggle]');
  heroToggle?.addEventListener('click', () => {
    const v = qs<HTMLVideoElement>('.g-hero video')!;
    const pause = !v.dataset.userPaused;
    v.dataset.userPaused = pause ? '1' : '';
    heroToggle.setAttribute('aria-pressed', String(pause));
    heroToggle.setAttribute('aria-label', pause ? 'Play background video' : 'Pause background video');
    if (pause) v.pause();
    else if (!reduced) v.play().catch(() => {});
  });

  /* ---------- Celebrations slider ---------- */
  const gallery = qs('[data-gallery]');
  if (gallery) {
    const slides = qsa('.g-slide', gallery);
    const caps = qsa('.g-cap', gallery);
    const thumbs = qsa<HTMLButtonElement>('[data-thumb]', gallery);
    const count = qs('[data-count]', gallery)!;
    const bar = qs<HTMLElement>('[data-progress]', gallery)!;
    let at = 0;
    const go = (i: number) => {
      at = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('on', k === at));
      caps.forEach((c, k) => {
        c.classList.toggle('on', k === at);
        c.setAttribute('aria-hidden', String(k !== at));
      });
      thumbs.forEach((t, k) => t.setAttribute('aria-pressed', String(k === at)));
      count.textContent = `${String(at + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      bar.style.transform = `scaleX(${(at + 1) / slides.length})`;
      const v = qs<HTMLVideoElement>('video', slides[at]);
      if (v && v.preload === 'none') {
        v.preload = 'auto';
        v.load();
      }
      syncVideos();
    };
    thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    qs('[data-prev]', gallery)!.addEventListener('click', () => go(at - 1));
    qs('[data-next]', gallery)!.addEventListener('click', () => go(at + 1));
    gallery.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(at + 1);
      if (e.key === 'ArrowLeft') go(at - 1);
    });
    // A horizontal swipe on the film moves between celebrations.
    const media = qs('.g-gallery__media', gallery)!;
    let startX = 0;
    let startY = 0;
    media.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
    });
    media.addEventListener('pointerup', (e) => {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - startY)) go(at + (dx < 0 ? 1 : -1));
    });
    go(0);
  }

  /* ---------- Existing shared behaviour ---------- */
  catalogue();
  quoteBuilder();
  morphDialog();
  qsa('[data-current-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

  /* ---------- Header follows the section beneath it ---------- */
  const head = qs('[data-head]')!;
  const setHead = (theme: string | undefined) => {
    head.classList.toggle('h-dark', theme === 'dark');
    head.classList.toggle('h-light', theme !== 'dark');
  };

  if (reduced) {
    // Native scrolling; the header still follows the sections.
    qsa('[data-header]').forEach((sec, i, all) =>
      ScrollTrigger.create({
        trigger: sec,
        start: () => `top ${head.offsetHeight / 2}px`,
        end: () => `bottom ${head.offsetHeight / 2}px`,
        onToggle: (self) => self.isActive && setHead(sec.dataset.header),
        onLeaveBack: () => i && setHead(all[i - 1].dataset.header),
      }),
    );
    setHead(qs('[data-header]')?.dataset.header);
    return;
  }

  smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1, smoothTouch: 0.1, effects: false });

  // Keyboard focus: browsers scroll the fixed wrapper to reveal a focused element,
  // which would knock the page out of line. Hold the wrapper at zero and let the
  // smoother bring the focused element into view instead.
  const wrap = qs('#smooth-wrapper')!;
  const pinWrap = () => {
    if (wrap.scrollTop || wrap.scrollLeft) {
      wrap.scrollTop = 0;
      wrap.scrollLeft = 0;
    }
  };
  wrap.addEventListener('scroll', pinWrap, { passive: true });
  document.addEventListener('focusin', (e) => {
    const el = e.target as HTMLElement;
    let n = 0;
    const tick = () => {
      pinWrap();
      if (++n < 20) requestAnimationFrame(tick);
    };
    tick();
    if (!wrap.contains(el) || el.closest('dialog')) return;
    const r = el.getBoundingClientRect();
    if (r.top < head.offsetHeight || r.bottom > innerHeight) smoother?.scrollTo(el, true, 'center center');
  });

  // The page holds still while the quote dialog or menu is open.
  const dialog = qs('#quote-builder');
  if (dialog) new MutationObserver(() => smoother?.paused(dialog.hasAttribute('open'))).observe(dialog, { attributes: true, attributeFilter: ['open'] });

  // In-page links glide through the smoother.
  qsa<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      // Let the menu finish closing (and unpause) before gliding.
      requestAnimationFrame(() => smoother?.scrollTo(target, true, id === 'top' ? 'top top' : `top ${head.offsetHeight}px`));
    }),
  );

  const build = () => {
    // Header theme switching
    const sections = qsa('[data-header]');
    sections.forEach((sec, i) =>
      ScrollTrigger.create({
        trigger: sec,
        start: () => `top ${head.offsetHeight / 2}px`,
        end: () => `bottom ${head.offsetHeight / 2}px`,
        onEnter: () => setHead(sec.dataset.header),
        onEnterBack: () => setHead(sec.dataset.header),
        onLeaveBack: () => i && setHead(sections[i - 1].dataset.header),
      }),
    );
    setHead(sections[0]?.dataset.header);

    // Headings rise in line by line, each line from behind its own mask.
    qsa('[data-split]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'g-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            rotate: 6,
            opacity: 0,
            transformOrigin: '0% 50%',
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          }),
      });
    });

    // Buttons and small blocks rise in once.
    qsa('[data-rise]').forEach((el) =>
      gsap.from(el, { yPercent: 20, y: 12, opacity: 0, duration: 0.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 96%', once: true } }),
    );

    // Pictures open from the bottom and settle from a slight zoom.
    qsa<HTMLImageElement>('[data-reveal] img').forEach((img) =>
      gsap.fromTo(
        img,
        { clipPath: 'inset(0 0 100% 0)', scale: 1.1 },
        { clipPath: 'inset(0 0 -5% 0)', scale: 1, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: img.parentElement, start: 'top 85%', toggleActions: 'play none none reverse' } },
      ),
    );

    gsap.matchMedia().add(PIN_MQ, () => {
      // Hero holds while the statement slides over it, lifting a little as it goes.
      const hero = qs('.g-hero');
      const statement = qs('.g-statement');
      if (hero && statement) {
        ScrollTrigger.create({ trigger: hero, start: 'top top', end: () => `+=${statement.offsetHeight}`, pin: true, pinSpacing: false });
        gsap.to(hero, { yPercent: -20, ease: 'none', scrollTrigger: { trigger: statement, start: 'top bottom', end: 'top top', scrub: true } });
      }

      // Statement: pinned for one more screen while the second sentence takes over.
      if (statement) {
        const [first, second] = qsa('.g-say', statement);
        if (first && second) {
          gsap.set(second, { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' });
          gsap
            .timeline({ scrollTrigger: { trigger: statement, start: 'top top', end: '+=100%', pin: true, scrub: 0.8 } })
            .to(first, { opacity: 0, yPercent: -18, filter: 'blur(6px)', duration: 1, ease: 'power2.in' }, 0.2)
            .fromTo(second, { opacity: 0, yPercent: 18, filter: 'blur(6px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }, 0.95)
            .to({}, { duration: 0.4 });
        }
      }

      // Left columns stay in view while the right side scrolls.
      qsa('[data-pin-left]').forEach((outer) => {
        const left = qs('.g-split__left', outer);
        if (!left) return;
        ScrollTrigger.create({ trigger: outer, start: () => `top ${head.offsetHeight + 48}px`, end: 'bottom bottom', pin: left, pinSpacing: false, invalidateOnRefresh: true, anticipatePin: 1 });
      });

      // Category pictures drift slightly against the scroll.
      qsa('.g-kind__media img').forEach((img) =>
        gsap.fromTo(img, { yPercent: 0 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }),
      );
    });

    // Opening an answer or filtering the catalogue changes the page height.
    qsa('details').forEach((d) => d.addEventListener('toggle', () => ScrollTrigger.refresh()));

    ScrollTrigger.refresh();
  };

  let built = false;
  const once = () => {
    if (built) return;
    built = true;
    build();
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(once);
  setTimeout(once, 1500); // a slow font must not hold the page
}
