import { config } from './config.js';

const CREATE_PATIENT_MUTATION = `
  mutation CreatePatient($input: PatientInput!) {
    createPatient(input: $input) {
      id
      fullName
      givenName
      familyName
      gender
      birthDate
      phone
      email
    }
  }
`;

const DELETE_PATIENT_MUTATION = `
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

const QUERY_ALL_PATIENTS = `{ patients(limit: 100) { patients { id fullName } } }`;

export async function createTestPatient(page, patient) {
  const response = await page.request.post(`${config.bffUrl}/graphql`, {
    data: JSON.stringify({
      query: CREATE_PATIENT_MUTATION,
      variables: { input: { ...patient, birthDate: patient.birthDate || null } }
    })
  });
  const result = await response.json();
  if (result.errors) {
    throw new Error(`Failed to create patient: ${result.errors.map(e => e.message).join(', ')}`);
  }
  return result.data.createPatient;
}

export async function deleteTestPatient(page, patientId) {
  await page.request.post(`${config.bffUrl}/graphql`, {
    data: JSON.stringify({
      query: DELETE_PATIENT_MUTATION,
      variables: { id: patientId }
    })
  });
}

export async function queryTestPatients(page) {
  const response = await page.request.post(`${config.bffUrl}/graphql`, {
    data: JSON.stringify({ query: QUERY_ALL_PATIENTS })
  });
  const result = await response.json();
  return result.data?.patients?.patients || [];
}

export function generateRandomPatient() {
  const timestamp = Date.now();
  return {
    givenName: `Test${timestamp}`,
    familyName: `Patient${timestamp}`,
    gender: 'male',
    birthDate: '1990-01-01',
    phone: '555-123-4567',
    email: `test${timestamp}@example.com`
  };
}
