import { test, expect } from '@playwright/test';

test.describe('Contact Form → WhatsApp', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept window.open before the page loads so it's always available
    await page.addInitScript(() => {
      window._lastOpenedURL = null;
      window.open = (url, target) => { window._lastOpenedURL = url; window._lastOpenedTarget = target; };
    });
    await page.goto('/index.html');
  });

  test('form submission opens a WhatsApp URL with encoded field values', async ({ page }) => {
    await page.fill('#name', 'Jane Doe');
    await page.fill('#phone', '0712345678');
    await page.selectOption('#service', { index: 1 });
    await page.fill('#message', 'I need a sofa.');
    await page.click('#contactForm button[type="submit"]');

    const url = await page.evaluate(() => window._lastOpenedURL);
    expect(url).toContain('wa.me/254759657163');
    expect(decodeURIComponent(url)).toContain('Jane Doe');
    expect(decodeURIComponent(url)).toContain('0712345678');
    expect(decodeURIComponent(url)).toContain('I need a sofa.');
  });

  test('window.open is called with "_blank" as second argument', async ({ page }) => {
    await page.fill('#name', 'Test');
    await page.fill('#phone', '0700000000');
    await page.click('#contactForm button[type="submit"]');

    const target = await page.evaluate(() => window._lastOpenedTarget);
    expect(target).toBe('_blank');
  });

  test('special characters in message are percent-encoded', async ({ page }) => {
    await page.fill('#name', 'A');
    await page.fill('#phone', '0700000000');
    await page.fill('#message', 'Price: 50% off & rush #1');
    await page.click('#contactForm button[type="submit"]');

    const url = await page.evaluate(() => window._lastOpenedURL);
    const encoded = url.split('?text=')[1];
    expect(encoded).toContain('%26');
    expect(encoded).toContain('%25');
  });

  test('spaces in name are %20 encoded, not +', async ({ page }) => {
    await page.fill('#name', 'Full Name');
    await page.fill('#phone', '0700000000');
    await page.click('#contactForm button[type="submit"]');

    const url = await page.evaluate(() => window._lastOpenedURL);
    expect(url).toContain('%20');
    expect(url).not.toContain('+');
  });
});
