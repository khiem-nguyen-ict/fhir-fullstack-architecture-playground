import { describe, it, expect } from "vitest";
import { typeDefs } from "../src/schema.js";

describe("GraphQL schema", () => {
  it("exports a non-empty typeDefs string", () => {
    expect(typeof typeDefs).toBe("string");
    expect(typeDefs.length).toBeGreaterThan(0);
  });

  it("contains Patient and PatientInput types", () => {
    expect(typeDefs).toContain("type Patient");
    expect(typeDefs).toContain("input PatientInput");
  });

  it("contains PatientPage with patients and totalCount", () => {
    expect(typeDefs).toContain("type PatientPage");
    expect(typeDefs).toContain("patients: [Patient!]!");
    expect(typeDefs).toContain("totalCount: Int!");
  });

  it("contains Query and Mutation definitions", () => {
    expect(typeDefs).toContain("type Query");
    expect(typeDefs).toContain("type Mutation");
  });

  it("patients query accepts offset and limit args", () => {
    expect(typeDefs).toContain("patients(offset: Int = 0, limit: Int): PatientPage!");
  });

  it("paginationConfig query exists", () => {
    expect(typeDefs).toContain("paginationConfig: PaginationConfig!");
    expect(typeDefs).toContain("type PaginationConfig");
    expect(typeDefs).toContain("defaultPageSize: Int!");
    expect(typeDefs).toContain("maxPageSize: Int!");
  });
});
