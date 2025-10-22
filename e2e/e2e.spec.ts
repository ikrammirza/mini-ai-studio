import { test, expect } from '@playwright/test';

test('Signup → Login → Generate Flow (mock)', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/Mini AI Studio/i);
  // Simulate signup form
  // Then simulate upload/generate
  // You can skip actual server calls if not running backend
});