import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/services/patientServiceClient.js", () => {
  const listPatients = vi.fn();
  const getPatient = vi.fn();
  const getPaginationConfig = vi.fn();
  const createPatient = vi.fn();
  const updatePatient = vi.fn();
  const deletePatient = vi.fn();

  return {
    patientServiceClient: {
      listPatients,
      getPatient,
      getPaginationConfig,
      createPatient,
      updatePatient,
      deletePatient,
    },
  };
});

import { patientQueries, patientMutations } from "../src/resolvers/patients.js";
import { patientServiceClient } from "../src/services/patientServiceClient.js";

describe("patientQueries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("patients delegates with offset and limit and returns PatientPage", async () => {
    const mockItems = [
      { id: 1, givenName: "Aino", familyName: "Virtanen", fullName: "Aino Virtanen", gender: "female", birthDate: "1988-04-12", phone: "+358401234567", email: "aino@example.fi" },
    ];
    patientServiceClient.listPatients.mockResolvedValue({ items: mockItems, total: 1 });

    const result = await patientQueries.patients(null, { offset: 0, limit: 10 });

    expect(patientServiceClient.listPatients).toHaveBeenCalledWith(0, 10, undefined, undefined, undefined, undefined, undefined);
    expect(result.patients).toHaveLength(1);
    expect(result.totalCount).toBe(1);
  });

  it("patients uses default offset 0 when not provided", async () => {
    patientServiceClient.listPatients.mockResolvedValue({ items: [], total: 0 });

    await patientQueries.patients(null, {});

    expect(patientServiceClient.listPatients).toHaveBeenCalledWith(0, undefined, undefined, undefined, undefined, undefined, undefined);
  });

  it("patients forwards search params", async () => {
    patientServiceClient.listPatients.mockResolvedValue({ items: [], total: 0 });

    await patientQueries.patients(null, { offset: 0, limit: 10, search: "john", filterField: ["givenName"], filterValue: ["john"] });

    expect(patientServiceClient.listPatients).toHaveBeenCalledWith(0, 10, undefined, undefined, "john", ["givenName"], ["john"]);
  });

  it("paginationConfig returns config from service client", async () => {
    patientServiceClient.getPaginationConfig.mockResolvedValue({ defaultPageSize: 10, maxPageSize: 100 });

    const result = await patientQueries.paginationConfig();

    expect(patientServiceClient.getPaginationConfig).toHaveBeenCalled();
    expect(result).toEqual({ defaultPageSize: 10, maxPageSize: 100 });
  });

  it("patient returns null for missing patient", async () => {
    patientServiceClient.getPatient.mockResolvedValue(null);

    const result = await patientQueries.patient(null, { id: "999" });

    expect(result).toBeNull();
  });

  it("patient transforms patient data correctly", async () => {
    const mockPatient = { id: "1", givenName: "John", familyName: "Doe", gender: "male", birthDate: "2000-01-01", phone: "555-1234", email: "john@example.com" };
    patientServiceClient.getPatient.mockResolvedValue(mockPatient);

    const result = await patientQueries.patient(null, { id: "1" });

    expect(result.id).toBe("1");
    expect(result.fullName).toBe("John Doe");
  });
});

describe("patientMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createPatient returns created patient", async () => {
    const created = { id: 1, givenName: "Aino", familyName: "Virtanen", fullName: "Aino Virtanen", gender: "female", birthDate: "1988-04-12", phone: "+358401234567", email: "aino@example.fi" };
    patientServiceClient.createPatient.mockResolvedValue(created);

    const result = await patientMutations.createPatient(null, { input: { givenName: "Aino", familyName: "Virtanen", gender: "female", birthDate: "1988-04-12", phone: "+358401234567", email: "aino@example.fi" } });

    expect(patientServiceClient.createPatient).toHaveBeenCalled();
    expect(result.fullName).toBe("Aino Virtanen");
  });

  it("updatePatient returns updated patient", async () => {
    const updated = { id: 1, givenName: "Updated", familyName: "Name", gender: "male", birthDate: "2000-01-01", phone: "555-1234", email: "updated@example.com" };
    patientServiceClient.updatePatient.mockResolvedValue(updated);

    const result = await patientMutations.updatePatient(null, { id: "1", input: { givenName: "Updated", familyName: "Name", phone: "555-1234", email: "updated@example.com" } });

    expect(patientServiceClient.updatePatient).toHaveBeenCalledWith("1", { givenName: "Updated", familyName: "Name", phone: "555-1234", email: "updated@example.com" });
    expect(result.fullName).toBe("Updated Name");
  });

  it("updatePatient returns null when patient not found", async () => {
    patientServiceClient.updatePatient.mockResolvedValue(null);

    const result = await patientMutations.updatePatient(null, { id: "999", input: { givenName: "Test", familyName: "User", phone: "555-1234", email: "test@example.com" } });

    expect(result).toBeNull();
  });

  it("deletePatient returns true on success", async () => {
    patientServiceClient.deletePatient.mockResolvedValue(undefined);

    const result = await patientMutations.deletePatient(null, { id: "1" });

    expect(patientServiceClient.deletePatient).toHaveBeenCalledWith("1");
    expect(result).toBe(true);
  });
});
