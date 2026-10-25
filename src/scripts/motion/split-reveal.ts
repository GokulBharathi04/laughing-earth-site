// Headlines with [data-split] rise line by line from behind a mask.
// data-split="load" plays on page load (heroes); anything else plays once on
// scroll. SplitText's autoSplit re-splits after resizes and font swaps.
import { gsap, SplitText, EASE, prefersReducedMotion } from './gsap';

export function init() {
  const targets = gsap.utils.toArray<HTMLElement>('[data-split]');
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add('is-split'));
    return;
  }

  targets.forEach((el) => {
    const onLoad = el.dataset.split === 'load';

    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: EASE.outStrong,
          stagger: 0.07,
          delay: onLoad ? 0.1 : 0,
          scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
}
