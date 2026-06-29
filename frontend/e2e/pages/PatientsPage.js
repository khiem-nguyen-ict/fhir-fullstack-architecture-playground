export class PatientsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  getPageTitle() {
    return this.page.locator('h1');
  }

  getLoadingSpinner() {
    return this.page.locator('.MuiCircularProgress-root');
  }

  getNoPatientsMessage() {
    return this.page.getByText('No patients found');
  }

  getPatientTable() {
    return this.page.locator('[aria-label="Patients list"]');
  }

  getPatientList() {
    return this.page.locator('table tbody tr');
  }

  getPatientByName(name) {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }

  async waitForPatients() {
    try {
      await this.page.waitForSelector('table', { timeout: 5000 });
    } catch {
      await this.page.waitForSelector('text=No patients found', { timeout: 5000 });
    }
  }
}