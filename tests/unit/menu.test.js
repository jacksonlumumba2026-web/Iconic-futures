import { openMenu, closeMenu, toggleMenu, initMenu } from '../../src/menu.js';

function makeMenu() {
  const menu = document.createElement('div');
  return menu;
}

describe('openMenu', () => {
  it('adds "open" class', () => {
    const menu = makeMenu();
    openMenu(menu);
    expect(menu.classList.contains('open')).toBe(true);
  });

  it('is idempotent — calling twice does not duplicate the class', () => {
    const menu = makeMenu();
    openMenu(menu);
    openMenu(menu);
    expect([...menu.classList].filter(c => c === 'open')).toHaveLength(1);
  });
});

describe('closeMenu', () => {
  it('removes "open" class', () => {
    const menu = makeMenu();
    menu.classList.add('open');
    closeMenu(menu);
    expect(menu.classList.contains('open')).toBe(false);
  });

  it('does not throw when "open" is already absent', () => {
    const menu = makeMenu();
    expect(() => closeMenu(menu)).not.toThrow();
    expect(menu.classList.contains('open')).toBe(false);
  });
});

describe('toggleMenu', () => {
  it('adds "open" when not present', () => {
    const menu = makeMenu();
    toggleMenu(menu);
    expect(menu.classList.contains('open')).toBe(true);
  });

  it('removes "open" when already present', () => {
    const menu = makeMenu();
    menu.classList.add('open');
    toggleMenu(menu);
    expect(menu.classList.contains('open')).toBe(false);
  });

  it('toggles back and forth correctly', () => {
    const menu = makeMenu();
    toggleMenu(menu);
    toggleMenu(menu);
    toggleMenu(menu);
    expect(menu.classList.contains('open')).toBe(true);
  });
});

describe('initMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="burger">Menu</button>
      <nav id="mobileMenu"></nav>
    `;
  });

  it('toggles menu open when burger is clicked', () => {
    initMenu(document);
    document.getElementById('burger').click();
    expect(document.getElementById('mobileMenu').classList.contains('open')).toBe(true);
  });

  it('toggles menu closed on second burger click', () => {
    initMenu(document);
    document.getElementById('burger').click();
    document.getElementById('burger').click();
    expect(document.getElementById('mobileMenu').classList.contains('open')).toBe(false);
  });

  it('does not throw when burger or mobileMenu is missing', () => {
    document.body.innerHTML = '';
    expect(() => initMenu(document)).not.toThrow();
  });
});
