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
  patients: async (_parent, { offset = 0, limit, sortBy, sortDirection, search, filterField, filterValue }) => {
    try {
      const page = await patientServiceClient.listPatients(offset, limit, sortBy, sortDirection, search, filterField, filterValue);
      return {
        patients: page.items.map(toGraphPatient),
        totalCount: page.total,
      };
    } catch (error) {
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
  },
  patient: async (_parent, { id }) => {
    try {
      const patient = await patientServiceClient.getPatient(id);
      return toGraphPatient(patient);
    } catch (error) {
      throw new Error(`Failed to fetch patient ${id}: ${error.message}`);
    }
  },
  paginationConfig: async () => {
    try {
      const config = await patientServiceClient.getPaginationConfig();
      return config;
    } catch (error) {
      throw new Error(`Failed to fetch pagination config: ${error.message}`);
    }
  },
};

export const patientMutations = {
  createPatient: async (_parent, { input }) => {
    try {
      const created = await patientServiceClient.createPatient(input);
      return toGraphPatient(created);
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  },
  updatePatient: async (_parent, { id, input }) => {
    try {
      const updated = await patientServiceClient.updatePatient(id, input);
      return toGraphPatient(updated);
    } catch (error) {
      throw new Error(`Failed to update patient ${id}: ${error.message}`);
    }
  },
  deletePatient: async (_parent, { id }) => {
    try {
      await patientServiceClient.deletePatient(id);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete patient ${id}: ${error.message}`);
    }
  },
};
