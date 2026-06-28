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
});
