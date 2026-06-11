import { handleNavScroll, SCROLL_THRESHOLD } from '../../src/nav.js';

function makeNav() {
  const nav = document.createElement('nav');
  document.body.appendChild(nav);
  return nav;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('SCROLL_THRESHOLD', () => {
  it('is exported and equals 60', () => {
    expect(SCROLL_THRESHOLD).toBe(60);
  });
});

describe('handleNavScroll — adds scrolled class above threshold', () => {
  it('adds "scrolled" when scrollY is 61 (above threshold)', () => {
    const nav = makeNav();
    handleNavScroll(nav, 61);
    expect(nav.classList.contains('scrolled')).toBe(true);
  });

  it('adds "scrolled" when scrollY is 1000', () => {
    const nav = makeNav();
    handleNavScroll(nav, 1000);
    expect(nav.classList.contains('scrolled')).toBe(true);
  });

  it('does NOT add "scrolled" when scrollY equals exactly 60 (threshold is strict >)', () => {
    const nav = makeNav();
    handleNavScroll(nav, 60);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });

  it('does NOT add "scrolled" when scrollY is 0', () => {
    const nav = makeNav();
    handleNavScroll(nav, 0);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });
});

describe('handleNavScroll — removes scrolled class when scrolling back up', () => {
  it('removes "scrolled" after scroll returns below threshold', () => {
    const nav = makeNav();
    handleNavScroll(nav, 100);
    expect(nav.classList.contains('scrolled')).toBe(true);
    handleNavScroll(nav, 50);
    expect(nav.classList.contains('scrolled')).toBe(false);
  });

  it('is idempotent — calling with 61 twice leaves class present once', () => {
    const nav = makeNav();
    handleNavScroll(nav, 61);
    handleNavScroll(nav, 61);
    expect(nav.classList.contains('scrolled')).toBe(true);
    expect([...nav.classList].filter(c => c === 'scrolled')).toHaveLength(1);
  });
});
