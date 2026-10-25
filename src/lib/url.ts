// Prefixes a root-relative path with the deploy base, so links and media work
// when the site is served from a subfolder (GitHub Pages serves it from
// /laughing-earth-site/). Locally and on a custom domain the base is '/', and
// paths come back unchanged. External, mailto:, tel: and #hash links pass through.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${BASE}${path}` || '/';
}
