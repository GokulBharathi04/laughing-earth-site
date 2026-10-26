// Boots the motion layer once web fonts are ready, so line splits and
// measurements use final metrics. Each module no-ops when its markup is absent.
import { init as smoothScroll } from './smooth-scroll';
import { init as splitReveal } from './split-reveal';
import { init as parallax } from './parallax';
import { init as morphDialog } from './morph-dialog';
import { init as loopGallery } from './loop-gallery';
import { init as cursorLabel } from './cursor-label';
import { init as video } from './video';
import { init as reveal } from './reveal';
import { init as marquee } from './marquee';
import { init as glass } from './glass';
import { ScrollTrigger } from './gsap';

const fontsReady = Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => setTimeout(resolve, 1200)),
]);

fontsReady.then(() => {
  smoothScroll();
  splitReveal();
  parallax();
  morphDialog();
  loopGallery();
  cursorLabel();
  video();
  reveal();
  marquee();
  glass();
  document.documentElement.classList.remove('is-loading');
  ScrollTrigger.refresh();
});

// Back/forward cache restores a frozen page: make sure nothing stays hidden.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) document.documentElement.classList.remove('is-loading');
});
