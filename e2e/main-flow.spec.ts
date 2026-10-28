import { test, expect } from '@playwright/test';
test('締め作業をチェックし最終確認して完了できる', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button',{name:/締め作業を開始/}).click();
  await expect(page.getByRole('button',{name:/最終確認へ/})).toBeDisabled();
  for (const button of await page.locator('.check-row').all()) await button.click();
  await page.getByRole('button',{name:/最終確認へ進む/}).click();
  await expect(page.getByRole('button',{name:/締め作業を完了/})).toBeDisabled();
  for (const button of await page.locator('.verify-row').all()) await button.click();
  await page.getByRole('button',{name:/締め作業を完了/}).click();
  await expect(page.getByRole('heading',{name:'おつかれさまでした'})).toBeVisible();
});
