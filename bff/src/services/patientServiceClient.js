import fetch from "node-fetch";

const PATIENT_SERVICE_URL =
  process.env.PATIENT_SERVICE_URL || "http://localhost:8081";

async function request(path, options = {}) {
  const res = await fetch(`${PATIENT_SERVICE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `patient-service ${options.method || "GET"} ${path} failed: ${res.status} ${body}`
    );
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const patientServiceClient = {
  listPatients: () => request("/api/patients"),
  getPatient: (id) => request(`/api/patients/${id}`),
  createPatient: (input) =>
    request("/api/patients", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updatePatient: (id, input) =>
    request(`/api/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deletePatient: (id) =>
    request(`/api/patients/${id}`, { method: "DELETE" }),
};