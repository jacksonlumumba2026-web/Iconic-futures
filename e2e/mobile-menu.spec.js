import { test, expect } from '@playwright/test';

// These tests run in the mobile project (iPhone 13 viewport) defined in playwright.config.js.
// They also run in desktop projects but the burger button may be hidden there — that is expected.

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('burger button opens the mobile menu', async ({ page }) => {
    const burger = page.locator('#burger');
    // Only interact if the burger is visible (mobile viewport)
    if (await burger.isVisible()) {
      await burger.click();
      await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    } else {
      test.skip();
    }
  });

  test('clicking a menu link closes the mobile menu', async ({ page }) => {
    const burger = page.locator('#burger');
    if (!(await burger.isVisible())) { test.skip(); return; }
    await burger.click();
    await expect(page.locator('#mobileMenu')).toHaveClass(/open/);
    // Click the first anchor with onclick="closeMenu()"
    await page.locator('#mobileMenu a[onclick*="closeMenu"]').first().click();
    await expect(page.locator('#mobileMenu')).not.toHaveClass(/open/);
  });
});

test.describe('Nav scroll behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('nav does not have "scrolled" class at top of page', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await expect(page.locator('#nav')).not.toHaveClass(/scrolled/);
  });

  test('nav gains "scrolled" class after scrolling more than 60px', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 61));
    await page.waitForTimeout(100);
    await expect(page.locator('#nav')).toHaveClass(/scrolled/);
  });

  test('nav loses "scrolled" class when scrolling back to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);
    await expect(page.locator('#nav')).toHaveClass(/scrolled/);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await expect(page.locator('#nav')).not.toHaveClass(/scrolled/);
  });
});
