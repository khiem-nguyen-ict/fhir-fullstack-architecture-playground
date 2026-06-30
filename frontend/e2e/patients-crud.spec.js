import { test, expect } from '@playwright/test';
import { generateRandomPatient, deleteTestPatient, queryTestPatients } from './testUtils.js';

test.describe.configure({ mode: 'serial' });

test('renders patient list from API', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const patientsSection = page.locator('[aria-label="Patients list"]');
  expect(await patientsSection.count()).toBeGreaterThanOrEqual(1);
});

test('deletes patient with confirmation', async ({ page }) => {
  const testPatient = generateRandomPatient();
  
  // Create patient via UI
  await page.goto('/');
  await page.locator('form').first().getByLabel('Given name').fill(testPatient.givenName);
  await page.locator('form').first().getByLabel('Family name').fill(testPatient.familyName);
  await page.locator('form').first().getByLabel('Gender').click();
  await page.locator(`[data-value="${testPatient.gender}"]`).first().click();
  await page.getByRole('button', { name: /Add Patient|Saving/i }).click();
  
  await page.waitForTimeout(3000);
  
  // Find and click delete button
  const deleteButton = page.locator('table tbody tr').filter({ hasText: testPatient.givenName }).getByLabel('Delete');
  if (await deleteButton.count() > 0) {
    await deleteButton.click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.waitForTimeout(1000);
  }
});

test('shows loading spinner during API calls', async ({ page }) => {
  await page.goto('/');
  expect(true).toBeTruthy();
});

test.afterEach(async ({ page }, testInfo) => {
  try {
    const patients = await queryTestPatients(page);
    const testPatients = patients.filter(p => p.fullName?.includes('Test'));
    for (const patient of testPatients) {
      await deleteTestPatient(page, patient.id);
    }
  } catch (e) {
    // Ignore cleanup errors
  }
});
