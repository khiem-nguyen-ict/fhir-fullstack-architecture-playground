import { describe, it, expect } from "vitest";
import { typeDefs } from "./schema.js";

describe("GraphQL schema", () => {
  it("exports a non-empty typeDefs string", () => {
    expect(typeof typeDefs).toBe("string");
    expect(typeDefs.length).toBeGreaterThan(0);
  });

  it("contains Patient and PatientInput types", () => {
    expect(typeDefs).toContain("type Patient");
    expect(typeDefs).toContain("input PatientInput");
  });

  it("contains Query and Mutation definitions", () => {
    expect(typeDefs).toContain("type Query");
    expect(typeDefs).toContain("type Mutation");
  });
});
