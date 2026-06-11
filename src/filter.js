export function filterCards(cat, btn, doc = document) {
  doc.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = doc.querySelectorAll('.card');
  let count = 0;
  cards.forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
    if (show) count++;
  });
  doc.getElementById('filterCount').textContent = count + ' items';
}

export function initFilter(doc = document) {
  doc.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterCards(btn.dataset.cat ?? 'all', btn, doc);
    });
  });
  // expose for inline onclick="filterCards(...)" attributes in HTML
  if (typeof window !== 'undefined') {
    window.filterCards = (cat, btn) => filterCards(cat, btn, doc);
  }
}

initFilter();
