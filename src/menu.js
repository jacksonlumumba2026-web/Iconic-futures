export function openMenu(mobileMenu) {
  mobileMenu.classList.add('open');
}

export function closeMenu(mobileMenu) {
  mobileMenu.classList.remove('open');
}

export function toggleMenu(mobileMenu) {
  mobileMenu.classList.toggle('open');
}

export function initMenu(doc = document) {
  const burger = doc.getElementById('burger');
  const mobileMenu = doc.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;
  burger.addEventListener('click', () => toggleMenu(mobileMenu));
  // expose for inline onclick="closeMenu()" anchor tags
  if (typeof window !== 'undefined') {
    window.closeMenu = () => closeMenu(mobileMenu);
  }
}
