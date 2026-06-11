import { openLightbox, closeLightbox, initLightbox } from '../../src/lightbox.js';

function makeLightboxDOM() {
  document.body.innerHTML = `
    <div id="lightbox">
      <button id="lightboxClose">✕</button>
      <img id="lightboxImg" src="" alt="" />
    </div>
    <div class="gallery__item"><img src="photo1.jpg" alt="" /></div>
    <div class="gallery__item"><img src="photo2.jpg" alt="" /></div>
    <div class="gallery__item no-img"><img src="" alt="" /></div>
    <div class="gallery__item no-img-inner"></div>
  `;
}

describe('openLightbox', () => {
  it('sets the src on the image element', () => {
    const lb = document.createElement('div');
    const img = document.createElement('img');
    openLightbox(lb, img, 'test.jpg');
    expect(img.src).toContain('test.jpg');
  });

  it('adds "open" class to the lightbox element', () => {
    const lb = document.createElement('div');
    const img = document.createElement('img');
    openLightbox(lb, img, 'test.jpg');
    expect(lb.classList.contains('open')).toBe(true);
  });
});

describe('closeLightbox', () => {
  it('removes "open" class', () => {
    const lb = document.createElement('div');
    lb.classList.add('open');
    closeLightbox(lb);
    expect(lb.classList.contains('open')).toBe(false);
  });

  it('does not throw when lightbox is already closed', () => {
    const lb = document.createElement('div');
    expect(() => closeLightbox(lb)).not.toThrow();
    expect(lb.classList.contains('open')).toBe(false);
  });
});

describe('initLightbox — gallery item clicks', () => {
  beforeEach(makeLightboxDOM);

  it('opens lightbox and sets image src when a gallery item with img is clicked', () => {
    initLightbox(document);
    document.querySelectorAll('.gallery__item')[0].click();
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    expect(lightbox.classList.contains('open')).toBe(true);
    expect(img.src).toContain('photo1.jpg');
  });

  it('does NOT open lightbox for items with the "no-img" class', () => {
    initLightbox(document);
    document.querySelector('.gallery__item.no-img').click();
    expect(document.getElementById('lightbox').classList.contains('open')).toBe(false);
  });

  it('does NOT open lightbox for items with no img child', () => {
    initLightbox(document);
    document.querySelector('.gallery__item.no-img-inner').click();
    expect(document.getElementById('lightbox').classList.contains('open')).toBe(false);
  });
});

describe('initLightbox — close interactions', () => {
  beforeEach(() => {
    makeLightboxDOM();
    initLightbox(document);
    // open the lightbox first
    document.querySelectorAll('.gallery__item')[0].click();
  });

  it('close button removes "open" class', () => {
    document.getElementById('lightboxClose').click();
    expect(document.getElementById('lightbox').classList.contains('open')).toBe(false);
  });

  it('clicking the backdrop (lightbox itself) closes it', () => {
    const lightbox = document.getElementById('lightbox');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: lightbox });
    Object.defineProperty(event, 'currentTarget', { value: lightbox });
    lightbox.dispatchEvent(event);
    expect(lightbox.classList.contains('open')).toBe(false);
  });

  it('clicking the img child does NOT close the lightbox', () => {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: img });
    Object.defineProperty(event, 'currentTarget', { value: lightbox });
    lightbox.dispatchEvent(event);
    expect(lightbox.classList.contains('open')).toBe(true);
  });
});

describe('initLightbox — missing DOM elements', () => {
  it('does not throw when lightbox elements are absent', () => {
    document.body.innerHTML = '';
    expect(() => initLightbox(document)).not.toThrow();
  });
});
