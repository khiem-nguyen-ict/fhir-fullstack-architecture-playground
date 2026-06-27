import { describe, it, expect } from "vitest";
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
});