import { describe, it, expect } from "vitest";
import { formatDate, DATE_FORMAT } from "./dateFormat.js";

describe("dateFormat", () => {
  it("has default DATE_FORMAT as dd/mm/yyyy", () => {
    expect(DATE_FORMAT).toBe("dd/mm/yyyy");
  });

  it("formats ISO date to dd/mm/yyyy", () => {
    expect(formatDate("1990-01-15")).toBe("15/01/1990");
  });

  it("formats ISO date with single digit day and month", () => {
    expect(formatDate("1990-01-05")).toBe("05/01/1990");
    expect(formatDate("1990-03-09")).toBe("09/03/1990");
  });

  it("returns null for empty string", () => {
    expect(formatDate("")).toBe(null);
  });

  it("returns null for null input", () => {
    expect(formatDate(null)).toBe(null);
  });

  it("returns null for undefined input", () => {
    expect(formatDate(undefined)).toBe(null);
  });

  it("returns null for invalid date string", () => {
    expect(formatDate("invalid")).toBe(null);
  });

  it("formats to mm/dd/yyyy when specified", () => {
    expect(formatDate("1990-01-15", "mm/dd/yyyy")).toBe("01/15/1990");
  });

  it("formats to yyyy-mm-dd when specified", () => {
    expect(formatDate("1990-01-15", "yyyy-mm-dd")).toBe("1990-01-15");
  });

  it("returns default format for unknown format string", () => {
    expect(formatDate("1990-01-15", "unknown-format")).toBe("15/01/1990");
  });
});