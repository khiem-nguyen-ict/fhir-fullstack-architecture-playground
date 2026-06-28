import { describe, it, expect } from "vitest";
import { formatPhone } from "./formatPhone.js";

describe("formatPhone", () => {
  it("returns null for null input", () => {
    expect(formatPhone(null)).toBe(null);
  });

  it("returns null for undefined input", () => {
    expect(formatPhone(undefined)).toBe(null);
  });

  it("returns null for empty string input", () => {
    expect(formatPhone("")).toBe(null);
  });

  it("returns null for input with no digits", () => {
    expect(formatPhone("abc")).toBe(null);
    expect(formatPhone("---")).toBe(null);
  });

  it("formats 7-digit phone number (XXX XXXX format)", () => {
    expect(formatPhone("5551234")).toBe("555 1234");
  });

  it("formats 10-digit phone number (XXX XXX XXXX format)", () => {
    expect(formatPhone("5551231234")).toBe("555 123 1234");
  });

  it("formats international phone number (X XXX XXX XXXX format)", () => {
    expect(formatPhone("+15551234567")).toBe("+1 555 123 4567");
  });

  it("formats phone number with special characters", () => {
    expect(formatPhone("555-123-4567")).toBe("555 123 4567");
    expect(formatPhone("(555) 123-4567")).toBe("555 123 4567");
    expect(formatPhone("+1 (555) 123-4567")).toBe("+1 555 123 4567");
  });

  it("formats phone number with spaces", () => {
    expect(formatPhone("555 123 4567")).toBe("555 123 4567");
  });

  it("handles mixed input with letters and special chars", () => {
    expect(formatPhone("555abc1234")).toBe("555 1234");
  });

  it("returns phone as-is when format doesn't match patterns", () => {
    expect(formatPhone("+44123456")).toBe("+44123456");
    expect(formatPhone("1234567")).toBe("123 4567");
  });
});