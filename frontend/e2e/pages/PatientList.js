export class PatientList {
  constructor(page) {
    this.page = page;
  }

  getPatientsTable() {
    return this.page.locator('[aria-label="Patients list"]');
  }

  getPatientRows() {
    return this.page.locator('table tbody tr');
  }

  getNoPatientsMessage() {
    return this.page.locator('[aria-label="Patients list"]').getByText('No patients found');
  }

  getPatientByName(name) {
    return this.page.locator('table tbody tr').filter({ hasText: name });
  }

  getEditButton(patientName) {
    return this.page.locator('table tbody tr').filter({ hasText: patientName }).getByLabel('View details');
  }

  getDeleteButton(patientName) {
    return this.page.locator('table tbody tr').filter({ hasText: patientName }).getByLabel('Delete');
  }

  async clickEdit(patientName) {
    await this.getEditButton(patientName).click();
  }

  async clickDelete(patientName) {
    await this.getDeleteButton(patientName).click();
  }

  getSortHeader(label) {
    return this.page.locator('table thead tr th').filter({ hasText: label }).getByRole('button');
  }

  async selectPageSize(size) {
    await this.getPageSizeSelect().click();
    await this.page.locator(`[data-value="${size}"]`).click();
  }

  getPagination() {
    return this.page.locator('.MuiPagination-root');
  }

  getPageSizeSelect() {
    return this.page.getByLabel('Page size');
  }
}