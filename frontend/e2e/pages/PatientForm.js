export class PatientForm {
  constructor(page) {
    this.page = page;
  }

  getGivenNameInput() {
    return this.page.locator('form').first().getByLabel('Given name');
  }

  getFamilyNameInput() {
    return this.page.locator('form').first().getByLabel('Family name');
  }

  getGenderSelect() {
    return this.page.locator('form').first().getByLabel('Gender');
  }

  getBirthDateInput() {
    return this.page.locator('form').first().getByLabel('Birth date');
  }

  getPhoneInput() {
    return this.page.locator('form').first().getByLabel('Phone');
  }

  getEmailInput() {
    return this.page.locator('form').first().getByLabel('Email');
  }

  getSubmitButton() {
    return this.page.getByRole('button', { name: /Add Patient|Saving/i });
  }

  getSuccessMessage() {
    return this.page.getByText('Patient created successfully');
  }

  getErrorMessage() {
    return this.page.locator('.MuiAlert-root.MuiAlert-color="error"');
  }

  async fillForm(patient) {
    await this.getGivenNameInput().fill(patient.givenName || '');
    await this.getFamilyNameInput().fill(patient.familyName || '');
    if (patient.gender) {
      await this.getGenderSelect().click();
      await this.page.locator(`[data-value="${patient.gender}"]`).first().click();
    }
    if (patient.birthDate) {
      await this.getBirthDateInput().fill(patient.birthDate);
    }
    if (patient.phone) {
      await this.getPhoneInput().fill(patient.phone);
    }
    if (patient.email) {
      await this.getEmailInput().fill(patient.email);
    }
  }

  async submit() {
    await this.getSubmitButton().click();
  }
}