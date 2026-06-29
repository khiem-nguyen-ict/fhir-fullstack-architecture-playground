import { test, expect } from '@playwright/test';
import { PatientsPage } from './pages/PatientsPage.js';
import { PatientForm } from './pages/PatientForm.js';
import { generateRandomPatient, deleteTestPatient } from './testUtils.js';

test.describe.configure({ mode: 'serial' });

test('smoke: app loads and displays header @smoke', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  await patientsPage.goto();
  
  await expect(patientsPage.getPageTitle()).toBeVisible();
  expect(await patientsPage.getPageTitle().textContent()).toContain('FHIR Full-Stack');
});

test('smoke: patient list renders @smoke', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  await patientsPage.goto();
  
  await patientsPage.waitForPatients();
  const hasPatients = await patientsPage.getPatientList().first().isVisible().catch(() => false);
  const noPatients = await patientsPage.getNoPatientsMessage().isVisible().catch(() => false);
  
  expect(hasPatients || noPatients).toBeTruthy();
});

test('smoke: patient form creates a new patient @smoke', async ({ page }) => {
  const patientsPage = new PatientsPage(page);
  const patientForm = new PatientForm(page);
  const testPatient = generateRandomPatient();
  
  await patientsPage.goto();
  
  await patientForm.fillForm(testPatient);
  await patientForm.submit();
  
  await page.waitForSelector('text=Patient created successfully', { timeout: 5000 });
  
  // Clean up
  const created = await page.request.post('http://localhost:4000/graphql', {
    data: JSON.stringify({ query: `{ patients(limit: 1 search: "${testPatient.givenName}") { patients { id } } }` })
  });
  const result = await created.json();
  const patientToDelete = result?.data?.patients?.patients?.[0];
  if (patientToDelete) {
    await deleteTestPatient(page, patientToDelete.id);
  }
});

test('smoke: no console errors on load @smoke', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  const patientsPage = new PatientsPage(page);
  await patientsPage.goto();
  await patientsPage.waitForPatients();
  
  expect(consoleErrors).toEqual([]);
});

test.afterEach(async ({ page }) => {
  // Clean up test patients
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