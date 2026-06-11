export function openLightbox(lightbox, lightboxImg, imgSrc) {
  lightboxImg.src = imgSrc;
  lightbox.classList.add('open');
}

export function closeLightbox(lightbox) {
  lightbox.classList.remove('open');
}

export function initLightbox(doc = document) {
  const lightbox = doc.getElementById('lightbox');
  const lightboxImg = doc.getElementById('lightboxImg');
  const lightboxClose = doc.getElementById('lightboxClose');
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  doc.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img || item.classList.contains('no-img')) return;
      openLightbox(lightbox, lightboxImg, img.src);
    });
  });

  lightboxClose.addEventListener('click', () => closeLightbox(lightbox));

  lightbox.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox(lightbox);
  });
}
