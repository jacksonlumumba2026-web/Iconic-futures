// ============================================
//  ICONIC FURNITURES — main.js
// ============================================

// --- NAV SCROLL ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// --- BURGER MENU ---
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu on outside click
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

// --- REVEAL ON SCROLL ---
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 120;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && img.src && !item.classList.contains('no-img')) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// --- CONTACT FORM → WHATSAPP ---
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  const text = `Hi Iconic Furnitures! 👋

*Name:* ${name}
*Phone:* ${phone}
*Service:* ${service || 'Not specified'}
*Message:* ${message || 'N/A'}

I'd love to discuss my project with you!`;

  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/254759657163?text=${encoded}`, '_blank');
});

// --- ACTIVE NAV HIGHLIGHT (optional) ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--gold)';
    }
  });
});
