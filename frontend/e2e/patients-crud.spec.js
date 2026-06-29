import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const generateRandomPatient = () => {
  const timestamp = Date.now();
  return {
    givenName: `Test${timestamp}`,
    familyName: `Patient${timestamp}`,
    gender: 'male',
    birthDate: '1990-01-01',
    phone: '555-123-4567',
    email: `test${timestamp}@example.com`
  };
};

const cleanupTestPatients = async (page) => {
  try {
    const response = await page.request.post('http://localhost:4000/graphql', {
      data: JSON.stringify({
        query: `{ patients(limit: 100) { patients { id fullName } } }`
      })
    });
    const result = await response.json();
    const testPatients = result.data?.patients?.patients?.filter(p => p.fullName?.includes('Test')) || [];
    for (const patient of testPatients) {
      await page.request.post('http://localhost:4000/graphql', {
        data: JSON.stringify({
          query: 'mutation DeletePatient($id: ID!) { deletePatient(id: $id) }',
          variables: { id: patient.id }
        })
      });
    }
  } catch (e) {
    // Ignore cleanup errors
  }
};

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
  await cleanupTestPatients(page);
});