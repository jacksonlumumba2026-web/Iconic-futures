import { test, expect } from '@playwright/test';

test.describe('Gallery Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('clicking a gallery item opens the lightbox', async ({ page }) => {
    await page.locator('.gallery__item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
  });

  test('lightboxImg src is set to the clicked image', async ({ page }) => {
    const firstItem = page.locator('.gallery__item').first();
    const expectedSrc = await firstItem.locator('img').getAttribute('src');
    await firstItem.click();
    const actualSrc = await page.locator('#lightboxImg').getAttribute('src');
    expect(actualSrc).toContain(expectedSrc ?? '');
  });

  test('close button removes the open class', async ({ page }) => {
    await page.locator('.gallery__item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await page.click('#lightboxClose');
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
  });

  test('clicking the backdrop (lightbox area outside image) closes the lightbox', async ({ page }) => {
    await page.locator('.gallery__item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    // Click the top-left corner of the lightbox overlay (backdrop area)
    await page.locator('#lightbox').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#lightbox')).not.toHaveClass(/open/);
  });

  test('clicking the image itself does NOT close the lightbox', async ({ page }) => {
    await page.locator('.gallery__item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
    await page.locator('#lightboxImg').click();
    await expect(page.locator('#lightbox')).toHaveClass(/open/);
  });
});
