import { test, expect } from '@playwright/test';

test.describe('Product Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iconic-furnitures-shop.html');
  });

  test('All filter shows 36 products on load', async ({ page }) => {
    await expect(page.locator('#filterCount')).toHaveText('36 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(36);
  });

  test('Indoor filter shows only indoor products', async ({ page }) => {
    await page.click('.filter-btn[data-cat="indoor"], button.filter-btn:has-text("Indoor")');
    await expect(page.locator('#filterCount')).toHaveText('4 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(4);
  });

  test('Outdoor filter shows only outdoor products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Outdoor")');
    await expect(page.locator('#filterCount')).toHaveText('17 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(17);
  });

  test('Kids filter shows only kids products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Kids")');
    await expect(page.locator('#filterCount')).toHaveText('15 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(15);
  });

  test('Re-clicking All after a category filter restores 36 products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Indoor")');
    await expect(page.locator('#filterCount')).toHaveText('4 items');
    await page.click('button.filter-btn:has-text("All")');
    await expect(page.locator('#filterCount')).toHaveText('36 items');
  });

  test('Only one filter button is active at a time', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Kids")');
    await page.click('button.filter-btn:has-text("Outdoor")');
    const activeButtons = await page.locator('.filter-btn.active').count();
    expect(activeButtons).toBe(1);
    await expect(page.locator('.filter-btn.active')).toHaveText('Outdoor');
  });
});
