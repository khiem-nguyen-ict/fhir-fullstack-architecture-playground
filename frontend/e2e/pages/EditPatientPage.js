export class EditPatientPage {
  constructor(page) {
    this.page = page;
  }

  getPageTitle() {
    return this.page.getByRole('heading', { name: 'Edit Patient' });
  }

  getLoadingMessage() {
    return this.page.getByText('Loading…');
  }

  getCancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  async waitForPageLoad() {
    await this.page.waitForSelector('text=Edit Patient', { timeout: 10000 });
  }
}