export const SCROLL_THRESHOLD = 60;

export function handleNavScroll(nav, scrollY) {
  nav.classList.toggle('scrolled', scrollY > SCROLL_THRESHOLD);
}

export function initNav(doc = document, win = window) {
  const nav = doc.getElementById('nav');
  if (!nav) return;
  win.addEventListener('scroll', () => handleNavScroll(nav, win.scrollY));
}
