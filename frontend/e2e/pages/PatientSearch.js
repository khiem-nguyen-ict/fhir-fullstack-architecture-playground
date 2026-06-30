export class PatientSearch {
  constructor(page) {
    this.page = page;
  }

  getGeneralSearchInput() {
    return this.page.getByPlaceholder('Search by name, email, or phone...');
  }

  getAdvancedSearchInput(label) {
    return this.page.locator('div[style*="flex-direction: column"]').getByLabel(label);
  }

  getSearchButton() {
    return this.page.getByRole('button', { name: 'Search' });
  }

  getClearSearchButton() {
    return this.page.locator('text=Clear search');
  }

  getToggleButtonGroup() {
    return this.page.locator('[role="group"]');
  }

  getGeneralTab() {
    return this.page.getByRole('button', { name: 'General' });
  }

  getAdvancedTab() {
    return this.page.getByRole('button', { name: 'Advanced' });
  }

  async clickSearch() {
    await this.getSearchButton().click();
  }

  async clickClear() {
    await this.getClearSearchButton().click();
  }

  async switchToAdvanced() {
    await this.getAdvancedTab().click();
  }

  async switchToGeneral() {
    await this.getGeneralTab().click();
  }
}