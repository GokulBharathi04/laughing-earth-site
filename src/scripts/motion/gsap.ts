// Single place where GSAP and its plugins are registered. Every motion module
// imports from here so plugins are registered exactly once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin);

// Easing in the spirit of tokens.css: things entering decelerate, things
// moving on screen ease in and out. No ease-in anywhere.
export const EASE = {
  out: 'power3.out',
  outStrong: 'power4.out',
  move: 'power2.inOut',
} as const;

// Breakpoints + motion preference, for gsap.matchMedia(). A component's setup
// runs again (and the previous one is reverted) whenever any condition flips.
export const CONDITIONS = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  pointer: '(hover: hover) and (pointer: fine)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export type Conditions = { [K in keyof typeof CONDITIONS]: boolean };

export const prefersReducedMotion = () => window.matchMedia(CONDITIONS.reduce).matches;

export function debounce<T extends (...args: never[]) => void>(fn: T, wait = 50) {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

export { gsap, ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin };
