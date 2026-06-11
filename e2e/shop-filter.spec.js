import { test, expect } from '@playwright/test';

test.describe('Product Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iconic-furnitures-shop.html');
  });

  test('All filter shows 40 products on load', async ({ page }) => {
    await expect(page.locator('#filterCount')).toHaveText('40 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(40);
  });

  test('Indoor filter shows only indoor products', async ({ page }) => {
    await page.click('.filter-btn[data-cat="indoor"], button.filter-btn:has-text("Indoor")');
    await expect(page.locator('#filterCount')).toHaveText('5 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(5);
  });

  test('Outdoor filter shows only outdoor products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Outdoor")');
    await expect(page.locator('#filterCount')).toHaveText('20 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(20);
  });

  test('Kids filter shows only kids products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Kids")');
    await expect(page.locator('#filterCount')).toHaveText('15 items');
    const visible = await page.locator('.card:visible').count();
    expect(visible).toBe(15);
  });

  test('Re-clicking All after a category filter restores 40 products', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Indoor")');
    await expect(page.locator('#filterCount')).toHaveText('5 items');
    await page.click('button.filter-btn:has-text("All")');
    await expect(page.locator('#filterCount')).toHaveText('40 items');
  });

  test('Only one filter button is active at a time', async ({ page }) => {
    await page.click('button.filter-btn:has-text("Kids")');
    await page.click('button.filter-btn:has-text("Outdoor")');
    const activeButtons = await page.locator('.filter-btn.active').count();
    expect(activeButtons).toBe(1);
    await expect(page.locator('.filter-btn.active')).toHaveText('Outdoor');
  });
});
