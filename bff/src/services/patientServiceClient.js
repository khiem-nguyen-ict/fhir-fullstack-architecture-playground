import fetch from "node-fetch";

const PATIENT_SERVICE_URL =
  process.env.PATIENT_SERVICE_URL || "http://localhost:8081";

export function validatePatientInput(input) {
  const errors = [];

  if (!input?.email?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.push("Invalid email");
  }

  if (!input?.phone?.trim()) {
    errors.push("Phone is required");
  } else if (!/^\+?\d[\d\s\-()]{7,18}\d$/.test(input.phone)) {
    errors.push("Invalid phone number");
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }
}

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
  listPatients: (offset = 0, limit, sortBy, sortDirection) => {
    const qs = new URLSearchParams();
    qs.set("offset", String(offset));
    if (limit != null) qs.set("limit", String(limit));
    if (sortBy != null) qs.set("sortBy", sortBy);
    if (sortDirection != null) qs.set("sortDirection", sortDirection);
    return request(`/api/patients?${qs.toString()}`);
  },
  getPatient: (id) => request(`/api/patients/${id}`),
  getPaginationConfig: () => request("/api/config/pagination"),
  createPatient: (input) => {
    validatePatientInput(input);
    return request("/api/patients", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  updatePatient: (id, input) => {
    validatePatientInput(input);
    return request(`/api/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  deletePatient: (id) =>
    request(`/api/patients/${id}`, { method: "DELETE" }),
};
