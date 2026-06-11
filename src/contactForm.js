export const WHATSAPP_NUMBER = '254759657163';

export function buildWhatsAppURL({ name, phone, service, message }) {
  const text = `Hi Iconic Furnitures! My name is ${name}, phone: ${phone}. I need: ${service}. ${message}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function initContactForm(doc = document, opener = (...args) => window.open(...args)) {
  const form = doc.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    opener(
      buildWhatsAppURL({
        name: doc.getElementById('name').value,
        phone: doc.getElementById('phone').value,
        service: doc.getElementById('service').value,
        message: doc.getElementById('message').value,
      }),
      '_blank'
    );
  });
}
