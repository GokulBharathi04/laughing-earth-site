// Chapter engine for the Landscaping page. One scroll model, one reveal system,
// one glide. Only entrances are declared: each exit is generated as their mirror,
// so a chapter at rest sits on the timeline's midpoint and scrolling up replays
// the entrance backwards. Nothing here is loaded by the Return Gifts side.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { whatsappLink } from '../../config/site';
import { init as enquiry } from './enquiry';

type Move = { els: Element[]; from: Record<string, any>; dur: number; ease: string; at?: number; stagger?: number };
type Chapter = HTMLElement & { _stop?: number };

const qs = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const qsa = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const isPhone = () => matchMedia('(max-width:800px)').matches;

export function init() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?snap=off keeps every reveal but gives the wheel and keys back to the browser.
  const snapOn = new URLSearchParams(location.search).get('snap') !== 'off';

  /* ================= UI that works with or without motion ================= */
  function setupHeader() {
    const header = qs('[data-header]');
    // The header stays transparent over the dark chapters, so the menu icon keeps its light colour.
    const sync = () => {
      header.classList.toggle('scrolled', scrollY > 24);
    };
    addEventListener('scroll', sync, { passive: true });
    sync();
  }

  function setupMenu() {
    const menu = qs('[data-menu]');
    const btn = qs('[data-menu-button]');
    const set = (open: boolean) => {
      menu.classList.toggle('open', open);
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };
    btn.addEventListener('click', () => set(!menu.classList.contains('open')));
    qsa('a', menu).forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') set(false);
    });
  }

  /* Clips play only while on screen; everything else stays paused. */
  function setupVideos() {
    const clips = qsa<HTMLVideoElement>('video');
    if (reduced) return;
    const shouldPlay = (v: HTMLVideoElement) => {
      const frame = v.closest('.frame');
      return !v.dataset.userPaused && (!frame || frame.classList.contains('on'));
    };
    const ahead = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && v.preload === 'none') {
            v.preload = 'auto';
            v.load();
          }
        });
      },
      { rootMargin: '100% 0px' },
    );
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        v.dataset.near = e.isIntersecting ? '1' : '';
        if (e.isIntersecting && shouldPlay(v)) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      });
      // A chapter resting just off screen touches the edge; that isn't "on screen".
    }, { threshold: 0.02 });
    clips.forEach((v) => {
      ahead.observe(v);
      io.observe(v);
    });
    setupVideos.sync = () =>
      clips.forEach((v) => {
        if (v.dataset.near && shouldPlay(v)) v.play().catch(() => {});
        else if (v.closest('.frame')) v.pause();
      });

    const toggle = qs('[data-video-toggle]');
    const hero = qs<HTMLVideoElement>('.hero video');
    toggle.addEventListener('click', () => {
      const pause = !hero.dataset.userPaused;
      hero.dataset.userPaused = pause ? '1' : '';
      toggle.setAttribute('aria-pressed', String(pause));
      toggle.setAttribute('aria-label', pause ? 'Play background video' : 'Pause background video');
      if (pause) hero.pause();
      else hero.play().catch(() => {});
    });
  }
  setupVideos.sync = () => {};

  /* Tags swap the stacked picture and its words together. */
  function setupFrames() {
    qsa('[data-frames]').forEach((sec) => {
      const tags = qsa('.tags button', sec);
      const frames = qsa('.frame', sec);
      const panels = qsa('.panel', sec);
      tags.forEach((tag, i) => {
        tag.addEventListener('click', () => {
          tags.forEach((t, k) => t.setAttribute('aria-pressed', String(k === i)));
          frames.forEach((f, k) => f.classList.toggle('on', k === i));
          panels.forEach((p, k) => p.classList.toggle('on', k === i));
          setupVideos.sync();
        });
      });
    });
    // The paving drawing takes its colours from the chosen material.
    const svg = qs('.pave-svg');
    qsa('.pave-ch .tags button').forEach((b) =>
      b.addEventListener('click', () => (svg.dataset.stone = b.dataset.stone)),
    );
    qsa<HTMLInputElement>('[name="pattern"]').forEach((r) =>
      r.addEventListener('change', () => {
        qsa('.pave-layout').forEach((g) => g.classList.toggle('on', g.dataset.pattern === r.value));
      }),
    );
  }

  /* Hero card: asks for a call back by morphing in one extra field. */
  function setupCard() {
    const card = qs('[data-card]');
    const form = qs<HTMLFormElement>('[data-card-form]', card);
    const modeBtn = qs('[data-card-mode]', card);
    const morph = qs('[data-morph]', card);
    const phone = qs<HTMLInputElement>('#c-phone', card);
    const name = qs<HTMLInputElement>('#c-name', card);
    const send = qs('[data-card-send]', card);
    let callback = false;
    modeBtn.addEventListener('click', () => {
      callback = !callback;
      phone.required = callback;
      phone.tabIndex = callback ? 0 : -1;
      send.textContent = callback ? 'Request the call back' : 'Continue on WhatsApp';
      modeBtn.textContent = callback ? 'Just message us instead' : 'Ask for a call back';
      if (reduced) {
        morph.style.height = callback ? 'auto' : '0';
        return;
      }
      const inner = morph.firstElementChild as HTMLElement;
      if (callback) {
        gsap.to(morph, { height: inner.offsetHeight + 20, duration: 0.6, ease: 'power3.out' });
        gsap.fromTo(
          inner,
          { y: 40, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, delay: 0.12, ease: 'power3.out' },
        );
      } else {
        gsap.to(morph, { height: 0, duration: 0.45, ease: 'power2.in' });
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      let msg = `Hi Laughing Earth! I'd like to discuss a landscaping project. This is ${name.value.trim()}.`;
      if (callback) msg += ` Please call me back on ${phone.value.trim()}.`;
      window.open(whatsappLink(msg), '_blank', 'noopener');
      const a = qs('.card-form', card);
      const b = qs('.card-done', card);
      a.style.display = 'none';
      b.hidden = false;
      if (!reduced) {
        gsap.from(qsa('.done-line span', b), { yPercent: 110, filter: 'blur(6px)', duration: 0.9, stagger: 0.1, ease: 'power3.out' });
      }
    });
  }

  /* Site visit: the existing enquiry form, shown one step at a time. */
  function setupWizard() {
    const form = qs<HTMLFormElement>('[data-enquiry-form]');
    const steps = qsa('[data-step]', form);
    const dots = qsa('.progress li');
    let at = 0;
    steps.forEach((s, i) => (s.hidden = i !== 0));
    const valid = (step: HTMLElement) => {
      let ok = true;
      qsa<HTMLInputElement>('input,select,textarea', step).forEach((f) => {
        const good = f.checkValidity();
        f.classList.toggle('invalid', !good);
        f.setAttribute('aria-invalid', String(!good));
        if (!good && ok) {
          f.reportValidity();
          ok = false;
        }
      });
      return ok;
    };
    const go = (i: number) => {
      const from = steps[at];
      const to = steps[i];
      at = i;
      dots.forEach((d, k) => {
        d.classList.toggle('active', k === i);
        d.classList.toggle('done', k < i);
      });
      const show = () => {
        from.hidden = true;
        to.hidden = false;
        qs<HTMLElement>('input,select,textarea', to)?.focus({ preventScroll: true });
      };
      if (reduced) return show();
      gsap.to(from, {
        opacity: 0,
        y: -14,
        filter: 'blur(5px)',
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(from, { clearProps: 'all' });
          show();
          gsap.fromTo(to, { opacity: 0, y: 18, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', clearProps: 'all' });
        },
      });
    };
    qsa('[data-next]', form).forEach((b) => b.addEventListener('click', () => valid(steps[at]) && go(at + 1)));
    qsa('[data-prev]', form).forEach((b) => b.addEventListener('click', () => go(at - 1)));
  }

  setupHeader();
  setupMenu();
  setupVideos();
  setupFrames();
  setupCard();
  setupWizard();
  enquiry();
  qsa('[data-current-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

  /* Reduced motion: no curtain, native scrolling, everything simply visible. */
  if (reduced) {
    qs('[data-preloader]').remove();
    return;
  }

  /* ================================ ENGINE ================================ */
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);

  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: snapOn ? 0.5 : 0.8,
    smoothTouch: 0.1,
    effects: false,
  });
  // Focusing a field makes browsers scroll the fixed wrapper; hold it at zero so
  // the smoother remains the only thing that moves the page.
  const wrap = qs('#smooth-wrapper');
  const pinWrap = () => {
    if (wrap.scrollTop || wrap.scrollLeft) {
      wrap.scrollTop = 0;
      wrap.scrollLeft = 0;
    }
  };
  wrap.addEventListener('scroll', pinWrap, { passive: true });
  document.addEventListener('focusin', () => {
    let n = 0;
    const tick = () => {
      pinWrap();
      if (++n < 20) requestAnimationFrame(tick);
    };
    tick();
  });

  const FEEL = { scrub: 1.2, start: 'top 50%', end: 'top -50%', hold: 0 };
  const SHOWN: Record<string, any> = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, filter: 'blur(0px)', strokeDashoffset: 0 };
  const sideways = (i: number) => (i % 2 ? 1 : -1) * innerWidth * 0.28;

  const shownFor = (from: Record<string, any>) => {
    const o: Record<string, any> = {};
    Object.keys(from).forEach((k) => {
      if (k !== 'transformOrigin') o[k] = k in SHOWN ? SHOWN[k] : 0;
    });
    return o;
  };
  const flipEase = (e: string) => {
    if (e.includes('.inOut')) return e;
    return e.includes('.out') ? e.replace('.out', '.in') : e.replace('.in', '.out');
  };
  const linesOf = (root: ParentNode, sel = 'h1,h2') => {
    let out: Element[] = [];
    qsa(sel, root).forEach((h) => {
      out = out.concat(new SplitText(h, { type: 'lines', linesClass: 'ed-line' }).lines as Element[]);
    });
    return out;
  };
  // One element, two tracks: movement lands first, blur resolves after it.
  const pair = (moves: Move[], els: Element[], travel: Record<string, any>, blur: number, dur: number, blurDur: number, at: number, ease: string, stagger?: number) => {
    if (!els.length) return;
    moves.push({ els, from: travel, dur, ease, at, stagger });
    moves.push({ els, from: { filter: `blur(${blur}px)` }, dur: blurDur, ease: 'power1.out', at, stagger });
  };

  /* The one motion vocabulary. Every chapter is described by the same rules. */
  function choreograph(ch: HTMLElement): Move[] {
    const moves: Move[] = [];
    if (ch.classList.contains('form-chapter')) {
      if (matchMedia('(max-width:1050px)').matches) pair(moves, [qs('.card', ch)], { y: 70, opacity: 0 }, 8, 2.4, 2.8, 0.3, 'power2.out');
      return moves;
    }
    pair(moves, qsa('.plate-ttl', ch), { yPercent: -240 }, 3, 1.4, 2, 0, 'power3.out');
    pair(moves, qsa('.plate-num', ch), { yPercent: 110 }, 3, 2.4, 3, 0.9, 'power3.out');
    pair(moves, linesOf(ch), { x: sideways, opacity: 0 }, 10, 4.4, 4.5, 0.1, 'power3.out');
    pair(moves, qsa('.eyebrow', ch), { x: 220, opacity: 0 }, 5, 1.8, 2.2, 1.6, 'power3.out', 0.15);
    pair(moves, qsa('.facts', ch), { y: -110, opacity: 0 }, 4, 2.6, 2.9, 1.5, 'power2.out');
    pair(moves, qsa('.lede', ch), { y: 46, opacity: 0 }, 4, 2.2, 2.6, 1.7, 'power2.out', 0.12);
    // Interactive blocks rise as whole units, never scrubbed field by field.
    pair(moves, qsa('.tags, .panels, .intro-figure, .drawing, .q-grid, .q-actions', ch), { y: 60, opacity: 0 }, 4, 2.3, 2.6, 1.9, 'power2.out', 0.18);
    if (qs('.client-grid', ch)) {
      moves.push({ els: qsa('.client-grid li', ch), from: { y: 40, opacity: 0 }, dur: 1.6, ease: 'power2.out', at: 1.7, stagger: 0.07 });
    }
    return moves;
  }

  function reveal(ch: HTMLElement, list: Move[]) {
    // Scrubbed blur pops on iOS Safari, so phones keep the slide and fade only.
    const moves = isPhone() ? list.filter((m) => m.from.filter == null) : list;
    if (!moves.length) return;
    moves.forEach((m) => {
      if (m.from.transformOrigin) gsap.set(m.els, { transformOrigin: m.from.transformOrigin });
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: FEEL.start, end: FEEL.end, scrub: FEEL.scrub } });
    let inEnd = 0;
    moves.forEach((m) => {
      inEnd = Math.max(inEnd, (m.at || 0) + m.dur + (m.stagger || 0) * (m.els.length - 1));
    });
    const holdEnd = inEnd + FEEL.hold;
    moves.forEach((m) => {
      const shown = shownFor(m.from);
      const at = m.at || 0;
      const stag = m.stagger || 0;
      const outVars: Record<string, any> = {
        ...m.from,
        duration: m.dur,
        ease: flipEase(m.ease),
        stagger: stag ? { each: stag, from: 'end' } : 0,
        immediateRender: false,
      };
      delete outVars.transformOrigin;
      tl.fromTo(m.els, m.from, { ...shown, duration: m.dur, ease: m.ease, stagger: stag }, at);
      tl.fromTo(m.els, shown, outVars, holdEnd + (inEnd - (at + m.dur)) - stag * (m.els.length - 1));
    });
    tl.to({}, { duration: holdEnd + inEnd }, 0); // pin the length so positions map exactly
  }

  /* Hero: a one-shot entrance released by the curtain, then a scrubbed exit. */
  const heroQueue: (() => void)[] = [];
  let heroGo = false;
  let heroCtx: gsap.Context | null = null;
  function buildHero(skipIntro: boolean) {
    heroCtx = gsap.context(() => {
      const wrapEl = qs('.hero-copy');
      const eyebrow = qs('.eyebrow', wrapEl);
      const small = qs('.hero-small', wrapEl);
      const lines = linesOf(wrapEl);
      const card = qs('[data-card]');
      const armOut = () => {
        gsap
          .timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: '.hero', start: 'top top', end: '40% top', scrub: 1.2 } })
          .fromTo(lines, { filter: 'blur(0px)' }, { filter: 'blur(8px)', duration: 0.5 }, 0)
          .fromTo(lines, { x: 0, opacity: 1 }, { x: sideways, opacity: 0, duration: 1 }, 0)
          .fromTo(eyebrow, { y: 0, opacity: 1, filter: 'blur(0px)' }, { y: 46, opacity: 0, filter: 'blur(5px)', duration: 0.95 }, 0)
          .fromTo(small, { y: 0, opacity: 1, filter: 'blur(0px)' }, { y: -26, opacity: 0, filter: 'blur(4px)', duration: 0.9, ease: 'power2.in' }, 0.1);
      };
      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: armOut }).timeScale(1.5);
      entrance
        .from('.site-head .wordmark', { opacity: 0, filter: 'blur(10px)', y: -8, duration: 3.6, ease: 'power1.out', clearProps: 'filter,opacity,transform' }, 0)
        .from(lines, { x: sideways, opacity: 0, duration: 2.6, ease: 'expo.out' }, 0.05)
        .from(lines, { filter: 'blur(16px)', duration: 3.06, ease: 'power1.out' }, 0.05)
        .from([eyebrow, small], { y: 46, opacity: 0, duration: 1.82, stagger: 0.15 }, 1.6)
        .from([eyebrow, small], { filter: 'blur(9px)', duration: 2.9, ease: 'power1.out', stagger: 0.15 }, 1.6)
        .from('.desktop-nav a', { opacity: 0, filter: 'blur(8px)', duration: 1.6, stagger: 0.05, ease: 'power2.out', clearProps: 'filter,opacity' }, 1.5)
        .from('.site-head > .switch, .head-end > *, .menu-button', { opacity: 0, filter: 'blur(8px)', duration: 1.7, ease: 'power2.out', clearProps: 'filter,opacity' }, 1.6);
      const play = (t: gsap.core.Animation) => {
        if (skipIntro) t.progress(1);
        else t.play(0);
      };
      if (heroGo) play(entrance);
      else heroQueue.push(() => play(entrance));

      if (matchMedia('(min-width:1051px)').matches) {
        const rise = gsap.from(card, {
          y: 90,
          opacity: 0,
          scale: 0.97,
          filter: 'blur(12px)',
          duration: 2.2,
          ease: 'power3.out',
          transformOrigin: '50% 100%',
          paused: true,
          delay: 0.9,
          onComplete: () => {
            gsap.fromTo(
              card,
              { y: 0, opacity: 1, filter: 'blur(0px)' },
              { y: -120, opacity: 0, filter: 'blur(6px)', ease: 'power2.out', immediateRender: false, scrollTrigger: { trigger: '.hero', start: '3% top', end: '33% top', scrub: 1.2 } },
            );
          },
        });
        if (heroGo) play(rise);
        else heroQueue.push(() => rise.play(0));
      }
    });
  }

  let chapterCtx: gsap.Context | null = null;
  function buildChapters() {
    chapterCtx = gsap.context(() => {
      qsa('.chapter').forEach((ch) => {
        if (!ch.classList.contains('hero')) reveal(ch, choreograph(ch));
      });
    });
  }

  /* Navigation: every input resolves through one glide. */
  const NAV_DUR = 1.2;
  const NAV_EASE = 'power2.inOut'; // soft start and soft landing
  const SETTLE_EASE = 'power3.out';
  const SETTLE_V0 = 4;
  const SETTLE_COAST = 0.4;
  const SETTLE_DUR = 0.7;
  // A chapter taller than the screen gets a second stop, so stepping never skips
  // the lower part of a form or an open question.
  function stops() {
    const max = ScrollTrigger.maxScroll(window);
    const vh = innerHeight;
    const out: number[] = [];
    qsa<Chapter>('.chapter').forEach((ch) => {
      const top = Math.min(ch.offsetTop, max);
      if (out.length && Math.abs(top - out[out.length - 1]) < 2) {
        ch._stop = out.length - 1;
        return;
      }
      ch._stop = out.length;
      out.push(top);
      const extra = ch.offsetHeight - vh;
      if (extra > 8) out.push(Math.min(top + extra, max));
    });
    return out;
  }
  let glide: (i: number, dur?: number, ease?: string) => void = () => {};
  function navigation() {
    let locked = false;
    let tween: gsap.core.Tween | null = null;
    let lockTimer: ReturnType<typeof setTimeout>;
    const y = () => smoother.scrollTop();
    const nearest = (pos: number) => {
      let best = 0;
      let d = Infinity;
      stops().forEach((t, i) => {
        const dd = Math.abs(t - pos);
        if (dd < d) {
          d = dd;
          best = i;
        }
      });
      return best;
    };
    glide = (i, dur = NAV_DUR, ease = NAV_EASE) => {
      const arr = stops();
      i = Math.max(0, Math.min(arr.length - 1, i));
      locked = true;
      const p = { v: y() };
      tween?.kill();
      tween = gsap.to(p, {
        v: arr[i],
        duration: dur,
        ease,
        onUpdate: () => smoother.scrollTop(p.v),
        onComplete: () => {
          locked = false;
        },
      });
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        locked = false;
      }, dur * 1000 + 250);
    };
    qsa<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href')!.slice(1);
        const target = document.getElementById(id);
        const ch = target?.closest<Chapter>('.chapter');
        if (!ch && id !== 'top') return; // #top is <main>: the way home, stop 0
        stops();
        e.preventDefault();
        const si = ch ? ch._stop! : 0;
        glide(si, Math.min(NAV_DUR + (Math.abs(si - nearest(y())) - 1) * 0.18, 2.2));
      });
    });
    // Opening or closing an answer can change a chapter's height.
    qsa('details').forEach((d) => d.addEventListener('toggle', () => ScrollTrigger.refresh()));
    if (!snapOn) return;

    gsap.matchMedia().add('(min-width:801px)', () => {
      const step = (d: number) => {
        if (!locked) glide(nearest(y()) + d);
      };
      // Trackpads keep firing inertia after a flick: only a pause or a stronger push is a new gesture.
      let lastT = 0;
      let lastD = 0;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const now = performance.now();
        const mag = Math.abs(e.deltaY);
        const fresh = now - lastT > 140 || mag > lastD * 1.6;
        lastT = now;
        lastD = mag;
        if (document.body.classList.contains('pl-active')) return;
        if (!locked && fresh && mag > 2) step(e.deltaY > 0 ? 1 : -1);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target as HTMLElement;
        if (t.matches?.('input,textarea,select,[type=radio]')) return;
        if (e.key === ' ' && t.matches?.('button,a,summary,[role=button]')) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault();
          step(1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          step(-1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          glide(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          glide(1e9);
        }
      };
      // Scrollbar: free while held; on release, momentum carries into the nearest chapter.
      let holding = false;
      const onDown = (e: PointerEvent) => {
        if (e.clientX >= document.documentElement.clientWidth || e.target === document.documentElement) {
          holding = true;
          if (tween) {
            tween.kill();
            locked = false;
          }
        }
      };
      const onUp = () => {
        if (!holding) return;
        holding = false;
        const v = smoother.getVelocity();
        const arr = stops();
        const i = nearest(y() + v * SETTLE_COAST);
        const D = arr[i] - y();
        if (Math.abs(D) < 6) return;
        const speed = Math.abs(v);
        if (speed > 50) glide(i, Math.max((Math.abs(D) * SETTLE_V0) / speed, SETTLE_DUR), SETTLE_EASE);
        else glide(i);
      };
      addEventListener('wheel', onWheel, { passive: false });
      addEventListener('keydown', onKey);
      addEventListener('pointerdown', onDown);
      addEventListener('pointerup', onUp);
      return () => {
        removeEventListener('wheel', onWheel);
        removeEventListener('keydown', onKey);
        removeEventListener('pointerdown', onDown);
        removeEventListener('pointerup', onUp);
      };
    });
  }

  /* Curtain: gates on the hero video, fonts and poster; never traps the visitor. */
  function preloader() {
    const pre = qs('[data-preloader]');
    const logo = qs('.pl-logo img', pre);
    const pct = qs('[data-pct]', pre);
    const shown = { v: 0 };
    const begun = performance.now();
    const fromFilm = document.documentElement.classList.contains('from-film');
    let revealed = false;
    let count = 0;
    document.body.classList.add('pl-active');
    const paint = () => {
      logo.style.filter = `blur(${((1 - shown.v) * 22).toFixed(2)}px)`;
      pct.textContent = String(Math.round(shown.v * 100));
    };
    paint();
    const vid = qs<HTMLVideoElement>('.hero video');
    const gates: ((done: () => void) => void)[] = [
      (done) => {
        if (vid.readyState >= 3) return done();
        ['canplay', 'loadeddata', 'error'].forEach((t) => vid.addEventListener(t, done, { once: true }));
      },
      (done) => {
        (document.fonts ? document.fonts.ready : Promise.resolve()).then(done);
      },
      (done) => {
        const im = new Image();
        im.onload = im.onerror = done;
        im.src = vid.getAttribute('poster') || '';
      },
    ];
    const lift = () => {
      if (revealed) return;
      revealed = true;
      const wait = fromFilm ? 0 : Math.max(0, 550 - (performance.now() - begun)) / 1000 + 0.35;
      gsap
        .timeline({
          delay: wait,
          onComplete: () => {
            document.body.classList.remove('pl-active');
            pre.remove();
            ScrollTrigger.refresh();
          },
        })
        .to(qs('.pl-logo', pre), { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .add(() => {
          pre.classList.add('lift');
          arriveAtHash();
        }, 0.15)
        .add(() => {
          heroGo = true;
          heroQueue.splice(0).forEach((f) => f());
        }, 1.15)
        .to({}, { duration: 0.5 });
    };
    // Straight from the film: no counter, just lift once the hero can play.
    if (fromFilm) {
      gates[0](lift);
      gsap.delayedCall(1.5, lift);
      return;
    }
    gates.forEach((g) => {
      let hit = false;
      g(() => {
        if (hit) return;
        hit = true;
        count++;
        gsap.to(shown, {
          v: count / gates.length,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
          onUpdate: paint,
          onComplete: () => {
            if (count >= gates.length) lift();
          },
        });
      });
    });
    gsap.delayedCall(5, () => {
      if (!revealed) gsap.to(shown, { v: 1, duration: 0.4, overwrite: 'auto', onUpdate: paint, onComplete: lift });
    });
  }

  // A deep link such as /landscaping/#visit lands on its chapter behind the curtain.
  function arriveAtHash() {
    const id = location.hash.slice(1);
    const ch = id ? document.getElementById(id)?.closest<Chapter>('.chapter') : null;
    if (!ch) return;
    const arr = stops();
    smoother.scrollTop(arr[ch._stop!]);
  }

  /* A width change re-wraps headlines, so splits and timelines are rebuilt. */
  function rebuildOnResize() {
    let w = innerWidth;
    let timer: ReturnType<typeof setTimeout>;
    addEventListener('resize', () => {
      if (innerWidth === w) return;
      w = innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => {
        chapterCtx?.revert();
        heroCtx?.revert();
        buildHero(true);
        buildChapters();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  preloader();
  navigation();
  let built = false;
  const build = () => {
    if (built) return;
    built = true;
    buildHero(false);
    buildChapters();
    ScrollTrigger.refresh();
    rebuildOnResize();
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
  setTimeout(build, 1500); // a slow font must not hold the page hostage
}
