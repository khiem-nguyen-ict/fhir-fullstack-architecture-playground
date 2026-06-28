import fetch from "node-fetch";

const PATIENT_SERVICE_URL =
  process.env.PATIENT_SERVICE_URL || "http://localhost:8081";

const ALLOWED_SORT_FIELDS = ["id", "givenName", "familyName", "email", "birthDate"];
const ALLOWED_SORT_DIRECTIONS = ["asc", "desc"];
const MAX_INPUT_LENGTH = 255;

function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

function validateInputLengths(input) {
  const errors = [];
  if (input.givenName && input.givenName.length > MAX_INPUT_LENGTH) {
    errors.push("givenName exceeds max length");
  }
  if (input.familyName && input.familyName.length > MAX_INPUT_LENGTH) {
    errors.push("familyName exceeds max length");
  }
  if (input.email && input.email.length > MAX_INPUT_LENGTH) {
    errors.push("email exceeds max length");
  }
  if (input.phone && input.phone.length > MAX_INPUT_LENGTH) {
    errors.push("phone exceeds max length");
  }
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }
}

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

  validateInputLengths(input);

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
  listPatients: (offset = 0, limit, sortBy, sortDirection, search, filterField, filterValue) => {
    const qs = new URLSearchParams();
    qs.set("offset", String(offset));
    if (limit != null) qs.set("limit", String(limit));
    if (sortBy != null && ALLOWED_SORT_FIELDS.includes(sortBy)) qs.set("sortBy", sortBy);
    if (sortDirection != null && ALLOWED_SORT_DIRECTIONS.includes(sortDirection)) qs.set("sortDirection", sortDirection);
    if (search != null && search.trim() !== "") qs.set("search", sanitizeString(search).substring(0, 100));
    if (filterField != null && filterField.length > 0) {
      filterField.forEach(f => {
        if (f && f.trim() !== "" && ALLOWED_SORT_FIELDS.includes(f.trim())) {
          qs.append("filterField", f.trim());
        }
      });
    }
    if (filterValue != null && filterValue.length > 0) {
      filterValue.forEach(v => { if (v && v.trim() !== "") qs.append("filterValue", sanitizeString(v).substring(0, 255)); });
    }
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
