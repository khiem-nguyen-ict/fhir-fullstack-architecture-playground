import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePatientInput, sanitizeString, ALLOWED_SORT_FIELDS, ALLOWED_FILTER_FIELDS } from "../src/services/patientServiceClient.js";

describe("validatePatientInput", () => {
  it("passes with valid email and phone", () => {
    const input = { email: "test@example.com", phone: "+1 (555) 123-4567" };
    expect(() => validatePatientInput(input)).not.toThrow();
  });

  it("fails with empty email", () => {
    const input = { email: "", phone: "5551234567" };
    expect(() => validatePatientInput(input)).toThrow("Email is required");
  });

  it("fails with missing email", () => {
    const input = { phone: "5551234567" };
    expect(() => validatePatientInput(input)).toThrow("Email is required");
  });

  it("fails with malformed email", () => {
    const input = { email: "invalid-email", phone: "5551234567" };
    expect(() => validatePatientInput(input)).toThrow("Invalid email");
  });

  it("fails with empty phone", () => {
    const input = { email: "test@example.com", phone: "" };
    expect(() => validatePatientInput(input)).toThrow("Phone is required");
  });

  it("fails with missing phone", () => {
    const input = { email: "test@example.com" };
    expect(() => validatePatientInput(input)).toThrow("Phone is required");
  });

  it("fails with malformed phone (too short)", () => {
    const input = { email: "test@example.com", phone: "123" };
    expect(() => validatePatientInput(input)).toThrow("Invalid phone number");
  });

  it("passes with various valid phone formats", () => {
    const validInputs = [
      { email: "test@example.com", phone: "5551234567" },
      { email: "test@example.com", phone: "+1 (555) 123-4567" },
      { email: "test@example.com", phone: "+44 20 7946 0958" },
    ];
    validInputs.forEach(input => {
      expect(() => validatePatientInput(input)).not.toThrow();
    });
  });

  it("fails with givenName exceeding max length", () => {
    const input = { email: "test@example.com", phone: "5551234567", givenName: "a".repeat(256) };
    expect(() => validatePatientInput(input)).toThrow("givenName exceeds max length");
  });

  it("fails with familyName exceeding max length", () => {
    const input = { email: "test@example.com", phone: "5551234567", familyName: "a".repeat(256) };
    expect(() => validatePatientInput(input)).toThrow("familyName exceeds max length");
  });

  it("fails with email exceeding max length", () => {
    const input = { email: "a".repeat(250) + "@example.com", phone: "5551234567" };
    expect(() => validatePatientInput(input)).toThrow("email exceeds max length");
  });

  it("fails with phone exceeding max length", () => {
    const input = { email: "test@example.com", phone: "a".repeat(256) };
    expect(() => validatePatientInput(input)).toThrow("phone exceeds max length");
  });

  it("passes with fields at exactly max length", () => {
    const input = { email: "a".repeat(245) + "@e.com", phone: "5551234567", givenName: "a".repeat(255), familyName: "b".repeat(255) };
    expect(() => validatePatientInput(input)).not.toThrow();
  });

  it("passes with valid birthDate", () => {
    const input = { email: "test@example.com", phone: "5551234567", birthDate: "1990-01-15" };
    expect(() => validatePatientInput(input)).not.toThrow();
  });

  it("fails with invalid birthDate format", () => {
    const input = { email: "test@example.com", phone: "5551234567", birthDate: "01-15-1990" };
    expect(() => validatePatientInput(input)).toThrow("Invalid birthDate format");
  });
});

describe("sanitizeString helper", () => {
  it("removes control characters from strings", () => {
    const testStr = "test\x00\x1F\x7Fvalue";
    expect(sanitizeString(testStr)).toBe("testvalue");
  });

  it("handles empty string", () => {
    const testStr = "";
    expect(sanitizeString(testStr)).toBe("");
  });

  it("handles non-string input", () => {
    expect(sanitizeString(123)).toBe(123);
    expect(sanitizeString(null)).toBe(null);
  });
});

describe("ALLOWED_SORT_FIELDS constant", () => {
  it("contains expected fields", () => {
    expect(ALLOWED_SORT_FIELDS).toContain("givenName");
    expect(ALLOWED_SORT_FIELDS).toContain("familyName");
    expect(ALLOWED_SORT_FIELDS).toContain("email");
    expect(ALLOWED_SORT_FIELDS).toContain("birthDate");
  });
});

describe("ALLOWED_FILTER_FIELDS constant", () => {
  it("contains expected filterable fields", () => {
    expect(ALLOWED_FILTER_FIELDS).toContain("givenName");
    expect(ALLOWED_FILTER_FIELDS).toContain("familyName");
    expect(ALLOWED_FILTER_FIELDS).toContain("email");
    expect(ALLOWED_FILTER_FIELDS).toContain("phone");
    expect(ALLOWED_FILTER_FIELDS).not.toContain("id");
    expect(ALLOWED_FILTER_FIELDS).not.toContain("birthDate");
  });
});
describe("listPatients query string serialization", () => {
  it("uses repeated bare key format for filters (Spring Boot compatible)", async () => {
    const logs = [];
    const origDebug = console.debug;
    console.debug = (...args) => logs.push(args.join(" "));

    const mod = await import("../src/services/patientServiceClient.js");
    try {
      await mod.patientServiceClient.listPatients(0, 25, "fullName", "asc", null, ["familyName", "phone"], ["holm", "0568"]);
    } catch {
      // node-fetch may fail in test env; we only inspect the URL
    }

    console.debug = origDebug;

    const debugLog = logs.find((l) => l.includes("query:"));
    expect(debugLog).toBeDefined();
    if (debugLog) {
      const queryString = debugLog.split("query: ")[1];
      expect(queryString).toContain("filterField=familyName");
      expect(queryString).toContain("filterField=phone");
      expect(queryString).toContain("filterValue=holm");
      expect(queryString).toContain("filterValue=0568");
    }
  });
});
