import { filterCards } from '../../src/filter.js';

function buildDOM() {
  document.body.innerHTML = `
    <button class="filter-btn active" data-cat="all">All</button>
    <button class="filter-btn" data-cat="indoor">Indoor</button>
    <button class="filter-btn" data-cat="outdoor">Outdoor</button>
    <button class="filter-btn" data-cat="kids">Kids</button>
    <span id="filterCount"></span>
    <div class="card" data-cat="indoor"></div>
    <div class="card" data-cat="indoor"></div>
    <div class="card" data-cat="outdoor"></div>
    <div class="card" data-cat="kids"></div>
    <div class="card" data-cat="kids"></div>
  `;
}

function btn(cat) {
  return document.querySelector(`.filter-btn[data-cat="${cat}"]`);
}

function visibleCards() {
  return [...document.querySelectorAll('.card')].filter(c => c.style.display !== 'none');
}

beforeEach(buildDOM);

describe('filterCards — category visibility', () => {
  it('shows all 5 cards and sets count label when cat is "all"', () => {
    filterCards('all', btn('all'), document);
    expect(visibleCards()).toHaveLength(5);
    expect(document.getElementById('filterCount').textContent).toBe('5 items');
  });

  it('shows only the 2 indoor cards', () => {
    filterCards('indoor', btn('indoor'), document);
    expect(visibleCards()).toHaveLength(2);
    expect(document.getElementById('filterCount').textContent).toBe('2 items');
    visibleCards().forEach(c => expect(c.dataset.cat).toBe('indoor'));
  });

  it('shows only the 1 outdoor card', () => {
    filterCards('outdoor', btn('outdoor'), document);
    expect(visibleCards()).toHaveLength(1);
    expect(document.getElementById('filterCount').textContent).toBe('1 items');
    visibleCards().forEach(c => expect(c.dataset.cat).toBe('outdoor'));
  });

  it('shows only the 2 kids cards', () => {
    filterCards('kids', btn('kids'), document);
    expect(visibleCards()).toHaveLength(2);
    expect(document.getElementById('filterCount').textContent).toBe('2 items');
    visibleCards().forEach(c => expect(c.dataset.cat).toBe('kids'));
  });

  it('shows 0 items for an unknown category', () => {
    filterCards('unknown', btn('all'), document);
    expect(visibleCards()).toHaveLength(0);
    expect(document.getElementById('filterCount').textContent).toBe('0 items');
  });

  it('hides non-matching cards by setting display to "none"', () => {
    filterCards('indoor', btn('indoor'), document);
    const hidden = [...document.querySelectorAll('.card')].filter(c => c.style.display === 'none');
    expect(hidden).toHaveLength(3);
    hidden.forEach(c => expect(c.dataset.cat).not.toBe('indoor'));
  });
});

describe('filterCards — re-filtering restores cards', () => {
  it('restores all cards after filtering then selecting All', () => {
    filterCards('indoor', btn('indoor'), document);
    expect(visibleCards()).toHaveLength(2);
    filterCards('all', btn('all'), document);
    expect(visibleCards()).toHaveLength(5);
  });

  it('is idempotent — calling twice with same category produces same result', () => {
    filterCards('kids', btn('kids'), document);
    filterCards('kids', btn('kids'), document);
    expect(visibleCards()).toHaveLength(2);
    expect(document.getElementById('filterCount').textContent).toBe('2 items');
  });
});

describe('filterCards — active button state', () => {
  it('adds "active" class to the clicked button', () => {
    filterCards('indoor', btn('indoor'), document);
    expect(btn('indoor').classList.contains('active')).toBe(true);
  });

  it('removes "active" class from all other buttons', () => {
    filterCards('indoor', btn('indoor'), document);
    expect(btn('all').classList.contains('active')).toBe(false);
    expect(btn('outdoor').classList.contains('active')).toBe(false);
    expect(btn('kids').classList.contains('active')).toBe(false);
  });

  it('only one button is active at a time across sequential filters', () => {
    filterCards('kids', btn('kids'), document);
    filterCards('outdoor', btn('outdoor'), document);
    const activeButtons = [...document.querySelectorAll('.filter-btn.active')];
    expect(activeButtons).toHaveLength(1);
    expect(activeButtons[0].dataset.cat).toBe('outdoor');
  });
});
