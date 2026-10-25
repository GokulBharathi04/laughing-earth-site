// A button that grows into a modal panel (Artem's pill-to-panel morph), built on
// the native <dialog> so focus trapping, Esc and the inert background come free.
//
//   <button data-morph-open="quote-builder">…</button>
//   <dialog id="quote-builder" data-morph-dialog>
//     <div data-morph-content>…<button data-morph-close>…</button></div>
//   </dialog>
//
// Opening clips the dialog down to the trigger's size and position, then
// releases it: clip-path + transform only. Closing runs faster than opening.
import { gsap, prefersReducedMotion } from './gsap';

const OPEN = { duration: 0.5, ease: 'expo.out' };
const CLOSE = { duration: 0.3, ease: 'power2.inOut' };

function clipFrom(trigger: HTMLElement, dialog: HTMLDialogElement) {
  const t = trigger.getBoundingClientRect();
  const d = dialog.getBoundingClientRect();
  const insetY = Math.max(0, (d.height - t.height) / 2);
  const insetX = Math.max(0, (d.width - t.width) / 2);
  return {
    clipPath: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round ${t.height / 2}px)`,
    x: t.left + t.width / 2 - (d.left + d.width / 2),
    y: t.top + t.height / 2 - (d.top + d.height / 2),
  };
}

const CLIP_OPEN = 'inset(0px 0px 0px 0px round 24px)';

export function init() {
  document.querySelectorAll<HTMLDialogElement>('dialog[data-morph-dialog]').forEach((dialog) => {
    const content = dialog.querySelector<HTMLElement>('[data-morph-content]');
    let trigger: HTMLElement | null = null;
    let closing = false;

    const lock = (locked: boolean) =>
      document.dispatchEvent(new CustomEvent(locked ? 'motion:lock' : 'motion:unlock'));

    function open(from: HTMLElement) {
      trigger = from;
      dialog.dispatchEvent(new CustomEvent('morph:open', { detail: { trigger: from } }));
      dialog.showModal();
      dialog.classList.add('is-open');
      lock(true);
      if (prefersReducedMotion()) return;

      gsap.killTweensOf([dialog, content]);
      gsap.fromTo(dialog, clipFrom(from, dialog), { clipPath: CLIP_OPEN, x: 0, y: 0, ...OPEN });
      if (content) {
        gsap.fromTo(content, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', delay: 0.12 });
      }
    }

    function close() {
      if (closing || !dialog.open) return;
      closing = true;
      dialog.classList.remove('is-open');

      const finish = () => {
        dialog.close();
        gsap.set([dialog, content], { clearProps: 'all' });
        lock(false);
        closing = false;
      };

      if (prefersReducedMotion() || !trigger || !trigger.isConnected) return finish();

      gsap.killTweensOf([dialog, content]);
      if (content) gsap.to(content, { opacity: 0, duration: 0.12, ease: 'power1.out' });
      gsap.to(dialog, { ...clipFrom(trigger, dialog), ...CLOSE, onComplete: finish });
    }

    document.querySelectorAll<HTMLElement>(`[data-morph-open="${dialog.id}"]`).forEach((btn) => {
      btn.addEventListener('click', () => open(btn));
    });

    dialog.querySelectorAll('[data-morph-close]').forEach((btn) => btn.addEventListener('click', close));

    // Esc: animate out instead of the browser's instant close.
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      close();
    });

    // A click on the dialog element itself is a click on the backdrop.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close();
    });

    dialog.addEventListener('morph:close', close);
  });
}
