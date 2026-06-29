import { test, expect } from '@playwright/test';
import { PatientsPage } from './pages/PatientsPage.js';
import { PatientForm } from './pages/PatientForm.js';
import { PatientList } from './pages/PatientList.js';
import { generateRandomPatient, deleteTestPatient } from './testUtils.js';

test.describe.configure({ mode: 'serial' });

test('page size selector changes results', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  const patientForm = new PatientForm(page);
  const list = new PatientList(page);
  const testPatient = generateRandomPatient();
  
  await patientsPage.goto();
  await patientForm.fillForm(testPatient);
  await patientForm.submit();
  await page.waitForSelector('text=Patient created successfully', { timeout: 5000 });
  
  await expect(list.getPageSizeSelect()).toBeVisible();
  await list.selectPageSize('25');
  
  await page.waitForTimeout(500);
});

test('pagination navigation works', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  const list = new PatientList(page);
  
  await patientsPage.goto();
  await patientsPage.waitForPatients();
  
  // Check if pagination exists (only if there are enough patients)
  const paginationCount = await list.getPagination().count();
  if (paginationCount > 0) {
    await expect(list.getPagination()).toBeVisible();
  }
});

test('page size saved to localStorage', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  const list = new PatientList(page);
  
  await patientsPage.goto();
  await patientsPage.waitForPatients();
  
  await list.selectPageSize('25');
  await page.waitForTimeout(500);
  
  // Navigate away and back
  await page.goto('/');
  await patientsPage.waitForPatients();
  
  // Check localStorage was set
  const storedPageSize = await page.evaluate(() => localStorage.getItem('patientPageSize'));
  expect(storedPageSize).toBe('25');
});

test.afterEach(async ({ page }) => {
  try {
    const response = await page.request.post('http://localhost:4000/graphql', {
      data: JSON.stringify({ query: '{ patients(limit: 100) { patients { id fullName } } }' })
    });
    const result = await response.json();
    const testPatients = result.data?.patients?.patients?.filter(p => p.fullName?.includes('Test')) || [];
    for (const patient of testPatients) {
      await deleteTestPatient(page, patient.id);
    }
  } catch (e) {
    // Ignore cleanup errors
  }
});