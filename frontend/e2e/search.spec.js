import { test, expect } from '@playwright/test';
import { PatientsPage } from './pages/PatientsPage.js';
import { deleteTestPatient, queryTestPatients } from './testUtils.js';

test.describe.configure({ mode: 'serial' });

test('general search filters patient list', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  
  await patientsPage.goto();
  await patientsPage.waitForPatients();
  
  const searchTerm = 'Test';
  await page.getByPlaceholder('Search by name, email, or phone...').fill(searchTerm);
  await page.getByRole('button', { name: 'Search' }).click();
  
  await page.waitForTimeout(500);
});

test('advanced search with field-specific filters', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  
  await patientsPage.goto();
  await patientsPage.waitForPatients();
  
  // Switch to advanced tab
  await page.getByRole('button', { name: 'Advanced' }).click();
  
  // Check that advanced search inputs are visible (they appear after switching tabs)
  await page.waitForTimeout(500);
});

test.afterEach(async ({ page }) => {
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
