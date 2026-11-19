// Services ring: the cards stand on a circle and the whole circle turns.
//
// Rebuilt from the "CardSlide 3D Click" demo (card-animation-26eef8.webflow.io,
// REA static evidence ev_be5386…): there, each card sits at
// rotateY(i · 360/n) translateZ(r) inside a perspective stage, and Prev/Next turn
// the ring by one step with a 1 s CSS transition. Kept: that geometry. Changed:
// the ring is pushed back by its radius so the front card renders at its true
// size (sharp text), and the far cards hide their backs instead of showing mirror
// images. Added: drag and swipe with momentum, click a side card to turn to it,
// click the front card to zoom it into a details panel, arrow keys, a live
// label, reduced motion. Without JavaScript the cards stay a plain row.
import gsap from 'gsap';
import { whatsappLink } from '../../config/site';

// The page's own curves (chapters.ts): its glide ease for a deliberate turn,
// its settle ease when a drag lets go, so the ring moves like the page does.
const TURN = { duration: 0.75, ease: 'power2.inOut' };
const RETARGET = { duration: 0.6, ease: 'power3.out' }; // pressed again mid-turn: no slow start
const SETTLE = { duration: 0.6, ease: 'power3.out' };
const ZOOM_IN = { duration: 0.6, ease: 'power3.out' };
const ZOOM_OUT = { duration: 0.45, ease: 'power2.inOut' };

/**
 * Which card a drag should come to rest on.
 *
 * @param position  where the ring is when the finger lifts, in cards (2.4 = 40% of the way from card 3 to card 4)
 * @param velocity  how fast it was turning, in cards per second (positive = towards the next card)
 * @returns         the card position to settle on (a whole number)
 *
 * Default: project the throw a fifth of a second ahead, so a quick flick moves
 * on even if it travelled less than half a card, but never land more than one
 * card beyond the nearest one, so a hard flick cannot spin past three services.
 */
export function settleIndex(position: number, velocity: number): number {
  const nearest = Math.round(position);
  const projected = Math.round(position + velocity * 0.2);
  return Math.max(nearest - 1, Math.min(nearest + 1, projected));
}

export function init() {
  const root = document.querySelector<HTMLElement>('[data-ring]');
  if (!root) return;
  const stage = root.querySelector<HTMLElement>('[data-ring-stage]')!;
  const track = root.querySelector<HTMLElement>('[data-ring-track]')!;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-ring-card]'));
  const buttons = cards.map((c) => c.querySelector<HTMLButtonElement>('[data-ring-open]')!);
  const prev = root.querySelector<HTMLButtonElement>('[data-ring-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-ring-next]')!;
  const countEl = root.querySelector<HTMLElement>('[data-ring-current]')!;
  const nameEl = root.querySelector<HTMLElement>('[data-ring-name]')!;
  const n = cards.length;
  if (n < 3) return; // a ring needs at least three sides
  const step = 360 / n;
  const names = cards.map((c) => c.dataset.name ?? '');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ring = { pos: 0 }; // where the ring is, in cards
  let target = 0; // where it is heading
  let radius = 0;
  let active = -1;
  let tween: gsap.core.Tween | null = null;
  let justDragged = false;

  const wrap = (i: number) => ((i % n) + n) % n;

  const render = () => {
    track.style.transform = `translateZ(${-radius}px) rotateY(${-ring.pos * step}deg)`;
  };

  // Geometry follows the card width set in CSS, so it is measured, not hard-coded.
  const layout = () => {
    const w = cards[0].offsetWidth;
    const h = Math.max(...cards.map((c) => c.offsetHeight));
    stage.style.height = `${h}px`;
    // Edge-to-edge radius plus a gap; narrow stages tighten the gap so the side
    // cards still peek in from the edges and invite a swipe.
    const gap = stage.offsetWidth < 600 ? 0.12 : 0.3;
    radius = Math.round(w / 2 / Math.tan(Math.PI / n) + w * gap);
    cards.forEach((c, i) => (c.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
    render();
  };

  const setActive = (pos: number) => {
    const i = wrap(Math.round(pos));
    if (i === active) return;
    const hadFocus = root.contains(document.activeElement) && document.activeElement !== prev && document.activeElement !== next;
    active = i;
    cards.forEach((c, k) => c.toggleAttribute('data-active', k === i));
    // Only the front card is a stop on the Tab path; the arrows turn the ring.
    buttons.forEach((b, k) => (b.tabIndex = k === i ? 0 : -1));
    if (hadFocus) buttons[i].focus({ preventScroll: true });
    countEl.textContent = String(i + 1).padStart(2, '0');
    nameEl.textContent = names[i];
    new Image().src = cards[i].dataset.detail ?? ''; // warm the details picture before it is asked for
  };

  const goTo = (to: number, feel = TURN) => {
    const turning = tween?.isActive() ?? false;
    tween?.kill();
    target = to;
    setActive(to);
    if (reduced) {
      ring.pos = to;
      render();
      return;
    }
    tween = gsap.to(ring, { pos: to, ...(turning && feel === TURN ? RETARGET : feel), onUpdate: render });
  };

  const goToCard = (k: number) => {
    let d = wrap(k - wrap(target));
    if (d > n / 2) d -= n; // the short way round
    if (d) goTo(target + d);
  };

  prev.addEventListener('click', () => goTo(target - 1));
  next.addEventListener('click', () => goTo(target + 1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(target + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(target - 1);
    }
  });

  /* Drag and swipe. The stage claims only horizontal movement (touch-action:
     pan-y in CSS), so a vertical swipe still scrolls the page. */
  type Drag = { id: number; x0: number; y0: number; pos0: number; lastX: number; lastT: number; v: number; axis: '' | 'x' };
  let drag: Drag | null = null;
  const perCard = () => cards[0].offsetWidth * 0.9; // pixels of drag that turn one card

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    justDragged = false;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, pos0: ring.pos, lastX: e.clientX, lastT: e.timeStamp, v: 0, axis: '' };
  });

  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.axis) {
      const dx = e.clientX - drag.x0;
      const dy = e.clientY - drag.y0;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag = null; // vertical: the page is scrolling
        return;
      }
      drag.axis = 'x';
      tween?.kill(); // catch the ring wherever it is
      drag.pos0 = ring.pos;
      drag.x0 = e.clientX;
      try {
        stage.setPointerCapture(e.pointerId); // keep the drag even if the finger leaves the stage
      } catch {
        /* the pointer already lifted: the drag still works while it stays over the stage */
      }
      root.classList.add('is-dragging');
    }
    ring.pos = drag.pos0 - (e.clientX - drag.x0) / perCard();
    render();
    setActive(ring.pos);
    const dt = (e.timeStamp - drag.lastT) / 1000;
    if (dt > 0) {
      const now = -(e.clientX - drag.lastX) / perCard() / dt;
      drag.v = drag.v * 0.6 + now * 0.4; // smoothed, so one jittery frame cannot fling it
    }
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;
  });

  const release = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    if (!d.axis) return; // a tap, handled by the card's click
    root.classList.remove('is-dragging');
    justDragged = true; // the click that follows a drag is not a choice
    const v = e.timeStamp - d.lastT > 100 ? 0 : d.v; // held still before letting go: no throw
    goTo(settleIndex(ring.pos, v), SETTLE);
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  // Images inside the cards must not start the browser's own drag-and-drop.
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  /* ---------- Details: the front card zooms up into a panel ---------- */
  const dialog = document.querySelector<HTMLDialogElement>('[data-svc-dialog]');
  const detail = dialog ? setupDetail(dialog) : null;

  buttons.forEach((b, k) =>
    b.addEventListener('click', () => {
      if (justDragged) return;
      if (k !== active) goToCard(k); // a side card turns to the front first
      else detail?.open(k);
    }),
  );

  /* ---------- Pictures side of the details panel: a slider ----------
     All of a service's photos, the card's own first. It turns on its own every
     few seconds (a thin line shows the wait), holds while a mouse is over the
     photos or the keyboard is on its buttons, and can be paused for good. The
     arrows, the arrow keys and a swipe turn it by hand. Each move slides the
     new photo in from the side it comes from while the picture inside lags a
     little behind its frame (parallax), and every move starts from wherever
     the photos are now, so a quick second press reverses smoothly. */
  function setupSlider(media: HTMLElement) {
    const sets = Array.from(media.querySelectorAll<HTMLElement>('[data-svc-d-slides]'));
    const pager = media.querySelector<HTMLElement>('[data-svc-d-pager]')!;
    const prevBtn = pager.querySelector<HTMLButtonElement>('[data-svc-d-prev]')!;
    const nextBtn = pager.querySelector<HTMLButtonElement>('[data-svc-d-next]')!;
    const playBtn = pager.querySelector<HTMLButtonElement>('[data-svc-d-play]')!;
    const countEl = pager.querySelector<HTMLElement>('[data-svc-d-pcount]')!;
    const nowEl = pager.querySelector<HTMLElement>('[data-svc-d-pnow]')!;
    const allEl = pager.querySelector<HTMLElement>('[data-svc-d-pall]')!;
    const bar = media.querySelector<HTMLElement>('[data-svc-d-bar]')!;
    const AUTO = 5; // seconds each photo stays
    const SLIDE = { duration: 0.9, ease: 'power3.inOut' }; // on-screen movement: ease in and out
    const DRIFT = 30; // how far (%) the picture lags behind its sliding frame
    const pad2 = (i: number) => String(i).padStart(2, '0');
    const imgOf = (s: HTMLElement) => s.querySelector('img')!;

    let slides: HTMLElement[] = [];
    let at = 0;
    let playing = !reduced; // no movement of its own for reduced motion; Play still offers it
    // Reasons to hold the wait: a mouse over the photos, the keyboard on its
    // buttons, a finger on the photos, or the photos scrolled out of view
    // (on a phone they leave the top of the sheet while the words are read).
    let hoverHold = false;
    let focusHold = false;
    let dragHold = false;
    let offHold = false;
    const held = () => hoverHold || focusHold || dragHold || offHold;
    let timer: gsap.core.Tween | null = null;

    const showPlayState = () => {
      playBtn.toggleAttribute('data-paused', !playing);
      playBtn.setAttribute('aria-label', playing ? 'Pause the slideshow' : 'Play the slideshow');
      // While it turns by itself, the count is not announced at every turn.
      countEl.setAttribute('aria-live', playing ? 'off' : 'polite');
    };

    const label = () => {
      nowEl.textContent = pad2(at + 1);
      slides.forEach((s, j) => s.setAttribute('aria-hidden', String(j !== at)));
    };

    // The wait is the progress line itself: when it fills, the next photo comes.
    const runTimer = () => {
      timer?.kill();
      timer = null;
      if (!playing || slides.length < 2) {
        gsap.set(bar, { scaleX: 0 });
        return;
      }
      timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: AUTO, ease: 'none', onComplete: () => go(at + 1, 1) });
      if (held()) timer.pause();
    };
    const hold = () => (held() ? timer?.pause() : timer?.resume());
    // A turn by hand means the visitor has taken over: the slideshow stops
    // turning by itself until they press Play again.
    const takeOver = () => {
      if (!playing) return;
      playing = false;
      showPlayState();
    };

    const go = (to: number, dir: 1 | -1, feel: gsap.TweenVars = SLIDE) => {
      const count = slides.length;
      if (count < 2) return;
      to = ((to % count) + count) % count;
      if (to === at) return;
      const a = slides[at];
      const b = slides[to];
      // Photos not taking part wait off to the side.
      slides.forEach((s, j) => {
        if (j === at || j === to) return;
        gsap.killTweensOf([s, imgOf(s)]);
        gsap.set(s, { xPercent: 100 });
        gsap.set(imgOf(s), { xPercent: 0 });
      });
      at = to;
      label();
      if (reduced) {
        gsap.set(a, { xPercent: 100 });
        gsap.set(b, { xPercent: 0 });
      } else {
        // Comes in from the side it is heading from, unless it is already on
        // its way back (a quick second press): then it carries on from there.
        const bx = Number(gsap.getProperty(b, 'xPercent'));
        if (Math.abs(bx) >= 100 || Math.sign(bx) !== dir) {
          gsap.set(b, { xPercent: 100 * dir });
          gsap.set(imgOf(b), { xPercent: -DRIFT * dir });
        }
        gsap.to(b, { xPercent: 0, ...feel, overwrite: true });
        gsap.to(imgOf(b), { xPercent: 0, ...feel, overwrite: true });
        gsap.to(a, { xPercent: -100 * dir, ...feel, overwrite: true });
        gsap.to(imgOf(a), { xPercent: DRIFT * dir, ...feel, overwrite: true });
      }
      runTimer();
    };

    prevBtn.addEventListener('click', () => {
      takeOver();
      go(at - 1, -1);
    });
    nextBtn.addEventListener('click', () => {
      takeOver();
      go(at + 1, 1);
    });
    playBtn.addEventListener('click', () => {
      playing = !playing;
      showPlayState();
      runTimer();
    });
    pager.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        takeOver();
        go(at + 1, 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        takeOver();
        go(at - 1, -1);
      }
    });
    // Out of view (scrolled off on a phone): no point turning unseen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([e]) => {
          offHold = !e.isIntersecting;
          hold();
        },
        { threshold: 0.35 },
      ).observe(media);
    }

    // Hold still while someone is looking: a mouse over the photos, or the
    // keyboard on the buttons (a mouse click's focus does not count).
    media.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      hoverHold = true;
      hold();
    });
    media.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      hoverHold = false;
      hold();
    });
    pager.addEventListener('focusin', (e) => {
      focusHold = (e.target as Element).matches?.(':focus-visible') ?? false;
      hold();
    });
    pager.addEventListener('focusout', (e) => {
      if (pager.contains(e.relatedTarget as Node)) return;
      focusHold = false;
      hold();
    });

    /* Swipe (finger, pen or a mouse drag). The photos follow the finger 1:1,
       the neighbour sliding in beside them, from the point where they were
       grabbed (even mid-slide). On release, a flick or a drag past a quarter of
       the frame carries on to that photo at the finger's own speed; less than
       that settles back. Upright movement is left to the page: the first ~8px
       decide (touch-action: pan-y in CSS keeps vertical scrolling native). */
    type Drag = { id: number; x0: number; y0: number; on: boolean; p: number; p0: number; dir: 1 | -1; v: number; lastX: number; lastT: number };
    let drag: Drag | null = null;
    const peerOf = (dir: 1 | -1) => slides[(at + dir + slides.length) % slides.length];
    const place = (s: HTMLElement, x: number) => {
      gsap.set(s, { xPercent: x });
      gsap.set(imgOf(s), { xPercent: (-x * DRIFT) / 100 }); // the same lag as a slide by button
    };

    media.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || slides.length < 2 || (e.target as Element).closest('button')) return;
      drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false, p: 0, p0: 0, dir: 1, v: 0, lastX: e.clientX, lastT: e.timeStamp };
    });
    media.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x0;
      if (!drag.on) {
        const dy = e.clientY - drag.y0;
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag = null; // upright: the page is scrolling
          return;
        }
        drag.on = true;
        try {
          media.setPointerCapture(e.pointerId);
        } catch {
          /* already lifted */
        }
        // Grab the photos wherever they are, mid-slide included.
        slides.forEach((s) => gsap.killTweensOf([s, imgOf(s)]));
        drag.p0 = Number(gsap.getProperty(slides[at], 'xPercent'));
        slides.forEach((s, j) => j !== at && place(s, 100));
        dragHold = true;
        hold();
      }
      const w = media.clientWidth || 1;
      drag.p = Math.max(-100, Math.min(100, drag.p0 + (dx / w) * 100));
      const dir: 1 | -1 = drag.p < 0 ? 1 : -1; // finger to the left: the next photo
      if (dir !== drag.dir) place(peerOf(drag.dir), 100); // the other neighbour goes back to wait
      drag.dir = dir;
      place(slides[at], drag.p);
      place(peerOf(dir), drag.p + 100 * dir);
      const dt = e.timeStamp - drag.lastT;
      if (dt > 0) drag.v = drag.v * 0.6 + ((e.clientX - drag.lastX) / dt) * 0.4; // px per ms, smoothed
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
    });
    const release = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      if (!d.on) return;
      dragHold = false;
      const w = media.clientWidth || 1;
      const v = e.timeStamp - d.lastT > 100 ? 0 : d.v; // held still before letting go: no throw
      const projected = (d.p / 100) * w + v * 180; // where the throw would carry it, in px
      const commit = Math.abs(projected) > w * 0.25 && Math.sign(projected) === Math.sign(d.p);
      if (commit) {
        takeOver();
        // Carry on at the finger's speed: the faster the flick, the shorter the glide.
        const left = (1 - Math.abs(d.p) / 100) * w;
        const duration = Math.min(0.55, Math.max(0.22, left / Math.max(Math.abs(v), 0.9) / 1000));
        go(at + d.dir, d.dir, { duration, ease: 'power2.out' });
      } else {
        const back = { duration: 0.4, ease: 'power3.out', overwrite: true };
        gsap.to(slides[at], { xPercent: 0, ...back });
        gsap.to(imgOf(slides[at]), { xPercent: 0, ...back });
        const peer = peerOf(d.dir);
        gsap.to(peer, { xPercent: 100 * d.dir, ...back });
        gsap.to(imgOf(peer), { xPercent: -DRIFT * d.dir, ...back });
        hold();
      }
    };
    media.addEventListener('pointerup', release);
    media.addEventListener('pointercancel', release);
    media.addEventListener('dragstart', (e) => e.preventDefault());

    showPlayState();

    return {
      /** Show service k's photos, from the first. */
      load(k: number) {
        sets.forEach((s, j) => (s.hidden = j !== k));
        slides = Array.from(sets[k]?.querySelectorAll<HTMLElement>('[data-svc-d-slide]') ?? []);
        at = 0;
        slides.forEach((s, j) => {
          gsap.killTweensOf([s, imgOf(s)]);
          gsap.set(s, { xPercent: j === 0 ? 0 : 100 });
          gsap.set(imgOf(s), { xPercent: 0 });
        });
        allEl.textContent = pad2(slides.length);
        pager.hidden = slides.length < 2;
        label();
        gsap.set(bar, { scaleX: 0 });
      },
      start() {
        hoverHold = media.matches(':hover');
        focusHold = false;
        runTimer();
      },
      stop() {
        timer?.kill();
        timer = null;
      },
      heroImg: () => (slides[0] ? imgOf(slides[0]) : null),
      atHero: () => at === 0,
    };
  }

  function setupDetail(dlg: HTMLDialogElement) {
    const q = <T extends Element = HTMLElement>(s: string) => dlg.querySelector<T>(s)!;
    const media = q('[data-svc-d-media]');
    const slider = setupSlider(media);
    const face = q('[data-svc-d-face]');
    const copy = Array.from(dlg.querySelectorAll<HTMLElement>('[data-svc-d-copy] > *'));
    // What is on show right now: the other services' stories are hidden and
    // must not take a turn in the staggered entrance.
    const shownCopy = () => copy.filter((el) => !el.hidden);
    // The way out (breadcrumb and close button) arrives with the panel's face
    // and leaves with it, so it never floats over the card while it zooms. It
    // fades by opacity alone: hiding it (visibility) would drop the focus that
    // the dialog has just given its back button.
    const chrome = Array.from(dlg.querySelectorAll<HTMLElement>('[data-svc-d-chrome]'));
    const fields = {
      num: q('[data-svc-d-num]'),
      crumb: q('[data-svc-d-crumb]'),
      title: q('[data-svc-d-title]'),
      list: q('[data-svc-d-list]'),
      cta: q<HTMLAnchorElement>('[data-svc-d-cta]'),
    };
    // Each service's story (its words) and photos are written into the panel
    // ahead of time; opening a card shows its own and hides the rest.
    const stories = Array.from(dlg.querySelectorAll<HTMLElement>('[data-svc-d-story]'));
    const scroller = q('[data-svc-d-copy]');
    let shownFor = -1;
    let busy = false;
    let closeWhenReady = false; // Back was pressed while the panel was still opening

    // Hold the page still behind the panel. Plain overflow, not the smoother's
    // pause, which would also swallow touch scrolling inside a tall panel on phones.
    const lock = (on: boolean) => {
      document.documentElement.style.overflow = on ? 'hidden' : '';
    };

    // Start state for the picture: scaled and clipped to sit exactly on the card.
    const fromCard = (cardImg: Element) => {
      const a = cardImg.getBoundingClientRect();
      const b = media.getBoundingClientRect();
      const s = Math.max(a.width / b.width, a.height / b.height);
      const cx = Math.max(0, (b.width - a.width / s) / 2);
      const cy = Math.max(0, (b.height - a.height / s) / 2);
      return {
        x: a.left + a.width / 2 - (b.left + b.width / 2),
        y: a.top + a.height / 2 - (b.top + b.height / 2),
        scale: s,
        clipPath: `inset(${cy}px ${cx}px round ${4 / s}px)`,
      };
    };

    const fill = (k: number) => {
      const card = cards[k];
      const src = card.querySelector('.ring-detail')!;
      fields.num.textContent = `${String(k + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      fields.crumb.textContent = names[k];
      fields.title.textContent = names[k];
      stories.forEach((s) => (s.hidden = s.dataset.svcDStory !== String(k)));
      fields.list.replaceChildren(
        ...Array.from(src.querySelectorAll('li')).map((li) => Object.assign(document.createElement('li'), { textContent: li.textContent })),
      );
      fields.cta.href = whatsappLink(`Hi Laughing Earth! I'd like a quote for ${names[k].toLowerCase()}.`);
      slider.load(k);
      shownFor = k;
    };

    // The panel is a step forward in the visitor's mind, so it gets its own
    // history entry: the phone's Back (Android's button or gesture, the iPhone's
    // edge swipe, the browser's back arrow) closes it instead of leaving the
    // page. The address stays the same, so a reload or a shared link is unaffected.
    let inHistory = false;

    const open = async (k: number) => {
      if (busy || dlg.open) return;
      busy = true;
      fill(k);
      dlg.showModal();
      // Each story starts at its top: on wide screens the words scroll inside
      // their column, on phones the whole sheet scrolls.
      scroller.scrollTop = 0;
      dlg.scrollTop = 0;
      lock(true);
      if (!inHistory) {
        history.pushState({ ...history.state, svcDetail: k }, '');
        inHistory = true;
      }
      if (!reduced) {
        gsap.set([media, face, ...copy], { autoAlpha: 0 });
        gsap.set(chrome, { opacity: 0 });
        // Let the picture decode first, but never keep the visitor waiting long.
        const hero = slider.heroImg();
        await Promise.race([hero ? hero.decode().catch(() => {}) : null, new Promise((r) => setTimeout(r, 300))]);
        gsap.set([media], { autoAlpha: 1 });
        gsap.fromTo(media, fromCard(buttons[k].querySelector('img')!), { x: 0, y: 0, scale: 1, clipPath: 'inset(0px 0px round 4px)', ...ZOOM_IN });
        gsap.to(face, { autoAlpha: 1, duration: 0.45, ease: 'power2.out', delay: 0.12 });
        gsap.to(chrome, { opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.2 });
        gsap.fromTo(shownCopy(), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.22 });
      }
      slider.start();
      busy = false;
      if (closeWhenReady) {
        closeWhenReady = false;
        close();
      }
    };

    const close = async () => {
      if (!dlg.open) return;
      if (busy) {
        closeWhenReady = true; // still opening: close as soon as it has
        return;
      }
      busy = true;
      slider.stop();
      if (!reduced && shownFor >= 0) {
        dlg.classList.add('is-closing');
        gsap.set(media, { clearProps: 'transform,clipPath' }); // measure the resting position
        const back = fromCard(buttons[shownFor].querySelector('img')!);
        // Back into the card only while the card's own picture is showing;
        // another photo would visibly turn into it, so then it simply fades.
        const away = slider.atHero() ? { ...back, ...ZOOM_OUT } : { autoAlpha: 0, scale: 0.97, duration: 0.3, ease: 'power2.inOut' };
        await gsap
          .timeline()
          .to(chrome, { opacity: 0, duration: 0.18, ease: 'power2.out' }, 0)
          .to(shownCopy(), { autoAlpha: 0, y: 8, duration: 0.18, ease: 'power2.out' }, 0)
          .to(face, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.05)
          .to(media, away, 0.05);
      }
      dlg.close(); // the 'close' handler below tidies up
    };

    // Every way out goes through history while the panel holds an entry, so the
    // on-screen buttons and the phone's Back always agree and never double up.
    const leave = () => {
      if (inHistory) history.back(); // the popstate handler runs the close
      else close();
    };
    addEventListener('popstate', () => {
      if (!inHistory) return;
      inHistory = false;
      close();
    });

    // Runs however the panel closes: our zoom-out, or the browser closing it
    // directly (a second Esc in a row cannot be held back for the animation).
    dlg.addEventListener('close', () => {
      gsap.killTweensOf([media, face, ...chrome, ...copy]);
      dlg.classList.remove('is-closing');
      gsap.set([media, face, ...chrome, ...copy], { clearProps: 'all' });
      lock(false);
      slider.stop();
      if (shownFor >= 0) buttons[shownFor].focus({ preventScroll: true });
      busy = false;
      closeWhenReady = false;
      // Closed without going through history (that second Esc): drop the entry
      // too, or the next Back would seem to do nothing.
      if (inHistory) {
        inHistory = false;
        history.back();
      }
    });

    q('[data-svc-d-back]').addEventListener('click', leave);
    q('[data-svc-d-close]').addEventListener('click', leave);
    dlg.addEventListener('cancel', (e) => {
      e.preventDefault(); // Esc: leave the way it came in
      leave();
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) leave(); // a click on the dimmed backdrop
    });
    return { open, close: leave };
  }

  let resizeTimer: ReturnType<typeof setTimeout>;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  /* Hand fan (landscape.css): the photos behind each card are fetched only
     where they can ever be seen, on a pointer that hovers, once the page is
     idle or as soon as the pointer reaches the ring. Phones never load them. */
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const loadFan = () =>
      root.querySelectorAll<HTMLImageElement>('[data-ring-fan] img[data-src]').forEach((im) => {
        im.src = im.dataset.src!;
        im.removeAttribute('data-src');
      });
    if ('requestIdleCallback' in window) requestIdleCallback(loadFan, { timeout: 4000 });
    else setTimeout(loadFan, 2000);
    root.addEventListener('pointerenter', loadFan, { once: true });
  }

  root.classList.add('is-ready'); // switches the CSS from a flat row to the ring
  layout();
  setActive(0);
  // Web fonts change the card heights once they arrive.
  document.fonts?.ready.then(layout);
}
