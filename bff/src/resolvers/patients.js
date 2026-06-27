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
  patients: async (_parent, { offset = 0, limit }) => {
    const page = await patientServiceClient.listPatients(offset, limit);
    return {
      patients: page.items.map(toGraphPatient),
      totalCount: page.total,
    };
  },
  patient: async (_parent, { id }) => {
    const patient = await patientServiceClient.getPatient(id);
    return toGraphPatient(patient);
  },
  paginationConfig: async () => {
    const config = await patientServiceClient.getPaginationConfig();
    return config;
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
