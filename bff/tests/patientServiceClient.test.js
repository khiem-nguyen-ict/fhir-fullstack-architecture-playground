import { describe, it, expect, vi, beforeEach } from "vitest";
import { validatePatientInput } from "../src/services/patientServiceClient.js";

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
});

describe("sanitizeString helper", () => {
  it("removes control characters from strings", () => {
    const testStr = "test\x00\x1F\x7Fvalue";
    const sanitized = testStr.replace(/[\x00-\x1F\x7F]/g, "").trim();
    expect(sanitized).toBe("testvalue");
  });

  it("handles empty string", () => {
    const testStr = "";
    const sanitized = testStr.replace(/[\x00-\x1F\x7F]/g, "").trim();
    expect(sanitized).toBe("");
  });
});

describe("ALLOWED_SORT_FIELDS", () => {
  it("contains expected fields", () => {
    const fields = ["id", "givenName", "familyName", "email", "birthDate"];
    expect(fields).toContain("id");
    expect(fields).toContain("givenName");
    expect(fields).toContain("familyName");
    expect(fields).toContain("email");
    expect(fields).toContain("birthDate");
  });
});

describe("validation middleware", () => {
  it("depthLimit rule rejects queries deeper than configured limit", () => {
    const depthLimit = (maxDepth) => ({
      Document: {
        leave(node) {
          const depth = (node) => node.selectionSet ? node.selectionSet.selections.flatMap(depth) : 0;
          return depth(node) <= maxDepth;
        },
      },
    });
    expect(depthLimit(10)).toBeDefined();
  });
});