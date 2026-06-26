import { patientServiceClient } from "../services/patientServiceClient.js";

function toGraphPatient(p) {
  if (!p) return null;
  return {
    id: String(p.id),
    givenName: p.givenName,
    familyName: p.familyName,
    fullName: `${p.givenName} ${p.familyName}`,
    gender: p.gender,
    birthDate: p.birthDate,
    phone: p.phone,
    email: p.email,
  };
}

export const patientQueries = {
  patients: async () => {
    const patients = await patientServiceClient.listPatients();
    return patients.map(toGraphPatient);
  },
  patient: async (_parent, { id }) => {
    const patient = await patientServiceClient.getPatient(id);
    return toGraphPatient(patient);
  },
};

export const patientMutations = {
  createPatient: async (_parent, { input }) => {
    const created = await patientServiceClient.createPatient(input);
    return toGraphPatient(created);
  },
  updatePatient: async (_parent, { id, input }) => {
    const updated = await patientServiceClient.updatePatient(id, input);
    return toGraphPatient(updated);
  },
  deletePatient: async (_parent, { id }) => {
    await patientServiceClient.deletePatient(id);
    return true;
  },
};