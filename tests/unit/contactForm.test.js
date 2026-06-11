import { buildWhatsAppURL, WHATSAPP_NUMBER, initContactForm } from '../../src/contactForm.js';

const SAMPLE = {
  name: 'Jane Doe',
  phone: '0712345678',
  service: 'Furniture Weaving',
  message: 'I need a sofa.',
};

describe('buildWhatsAppURL — URL structure', () => {
  it('returns a URL starting with the correct wa.me base', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
  });

  it('includes the WhatsApp number 254759657163', () => {
    expect(WHATSAPP_NUMBER).toBe('254759657163');
    expect(buildWhatsAppURL(SAMPLE)).toContain('254759657163');
  });

  it('includes "Hi Iconic Furnitures!" prefix verbatim in the encoded text', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(decodeURIComponent(url.split('?text=')[1])).toContain('Hi Iconic Furnitures!');
  });
});

describe('buildWhatsAppURL — field interpolation', () => {
  it('encodes the name into the URL', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(decodeURIComponent(url)).toContain('Jane Doe');
  });

  it('encodes the phone into the URL', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(decodeURIComponent(url)).toContain('0712345678');
  });

  it('encodes the service into the URL', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(decodeURIComponent(url)).toContain('Furniture Weaving');
  });

  it('encodes the message into the URL', () => {
    const url = buildWhatsAppURL(SAMPLE);
    expect(decodeURIComponent(url)).toContain('I need a sofa.');
  });

  it('percent-encodes spaces as %20, not as +', () => {
    const url = buildWhatsAppURL({ ...SAMPLE, name: 'Full Name' });
    expect(url).toContain('%20');
    expect(url).not.toContain('+');
  });

  it('percent-encodes special characters (&, =, #)', () => {
    const url = buildWhatsAppURL({ ...SAMPLE, message: 'Price: 50% off & rush #1' });
    const encoded = url.split('?text=')[1];
    expect(encoded).toContain('%26');
    expect(encoded).toContain('%25');
    expect(encoded).toContain('%23');
  });

  it('produces a valid URL when service is empty', () => {
    const url = buildWhatsAppURL({ ...SAMPLE, service: '' });
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
    expect(() => new URL(url)).not.toThrow();
  });

  it('produces a valid URL when message is empty', () => {
    const url = buildWhatsAppURL({ ...SAMPLE, message: '' });
    expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
    expect(() => new URL(url)).not.toThrow();
  });
});

describe('initContactForm — form submit behaviour', () => {
  function buildFormDOM() {
    document.body.innerHTML = `
      <form id="contactForm">
        <input id="name" value="Jane Doe" />
        <input id="phone" value="0712345678" />
        <select id="service"><option value="Sofa" selected>Sofa</option></select>
        <textarea id="message">Test message</textarea>
        <button type="submit">Send</button>
      </form>
    `;
  }

  beforeEach(buildFormDOM);

  it('calls opener with a WhatsApp URL on submit', () => {
    const opener = vi.fn();
    initContactForm(document, opener);
    document.getElementById('contactForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(opener).toHaveBeenCalledOnce();
    const [url] = opener.mock.calls[0];
    expect(url).toContain(`wa.me/${WHATSAPP_NUMBER}`);
  });

  it('calls opener with "_blank" as the second argument', () => {
    const opener = vi.fn();
    initContactForm(document, opener);
    document.getElementById('contactForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(opener.mock.calls[0][1]).toBe('_blank');
  });

  it('prevents default form submission', () => {
    const opener = vi.fn();
    initContactForm(document, opener);
    const event = new Event('submit', { bubbles: true, cancelable: true });
    const spy = vi.spyOn(event, 'preventDefault');
    document.getElementById('contactForm').dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('includes field values from the form in the URL', () => {
    const opener = vi.fn();
    initContactForm(document, opener);
    document.getElementById('contactForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const url = decodeURIComponent(opener.mock.calls[0][0]);
    expect(url).toContain('Jane Doe');
    expect(url).toContain('0712345678');
  });

  it('does nothing when contactForm element is missing from DOM', () => {
    document.body.innerHTML = '';
    const opener = vi.fn();
    expect(() => initContactForm(document, opener)).not.toThrow();
    expect(opener).not.toHaveBeenCalled();
  });
});
