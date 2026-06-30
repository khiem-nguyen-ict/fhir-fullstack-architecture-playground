import { test, expect } from '@playwright/test';
import { PatientsPage } from './pages/PatientsPage.js';

test.describe.configure({ mode: 'serial' });

test('theme toggle switches modes', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  await patientsPage.goto();
  
  const themeToggle = page.getByLabel('theme-toggle');
  await expect(themeToggle).toBeVisible();
  
  // Get initial theme state
  const initialTheme = await page.evaluate(() => localStorage.getItem('theme') || 'light');
  
  // Click to toggle
  await themeToggle.click();
  
  // Check theme changed
  const newTheme = await page.evaluate(() => localStorage.getItem('theme'));
  expect(newTheme).not.toBe(initialTheme);
});

test('theme persists across page reloads', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  await patientsPage.goto();
  
  const themeToggle = page.getByLabel('theme-toggle');
  await themeToggle.click();
  
  const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
  
  await page.reload();
  await patientsPage.waitForPatients();
  
  const persistedTheme = await page.evaluate(() => localStorage.getItem('theme'));
  expect(persistedTheme).toBe(savedTheme);
});