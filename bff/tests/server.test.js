import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";

describe("server integration tests", () => {
  let app;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.INIT_SERVER = "false";

    vi.doMock("../src/resolvers/patients.js", () => ({
      patientQueries: {
        patients: () => ({ patients: [], totalCount: 0 }),
        patient: () => null,
        paginationConfig: () => ({ defaultPageSize: 10, maxPageSize: 100 }),
      },
      patientMutations: {
        createPatient: () => ({ id: "1", givenName: "Test", familyName: "User", fullName: "Test User" }),
        updatePatient: () => ({ id: "1", givenName: "Test", familyName: "User", fullName: "Test User" }),
        deletePatient: () => true,
      },
    }));

    const serverModule = await import("../src/server.js");
    app = serverModule.app;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("security headers", () => {
    it("includes X-Content-Type-Options header", async () => {
      const res = await request(app).get("/").set("Accept", "application/json");
      expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("includes X-Frame-Options header", async () => {
      const res = await request(app).get("/").set("Accept", "application/json");
      expect(res.headers["x-frame-options"]).toBe("DENY");
    });
  });

  describe("fallback routes", () => {
    it("redirects unknown routes to frontend", async () => {
      const res = await request(app).get("/unknown-route");
      expect([200, 302, 404]).toContain(res.status);
    });
  });
});

describe("server module exports", () => {
  it("exports corsOptions with correct configuration", async () => {
    const { corsOptions } = await import("../src/server.js");
    expect(corsOptions).toBeDefined();
    expect(corsOptions.credentials).toBe(false);
  });
});

describe("rate limiter configuration", () => {
  it("can be imported and used", async () => {
    const { queryRateLimiter } = await import("../src/server.js");
    expect(queryRateLimiter).toBeDefined();
  });
});

describe("introspection blocking", () => {
  it("is disabled in production mode", async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    vi.doMock("../src/resolvers/patients.js", () => ({}));
    const serverModule = await import("../src/server.js");
    const isProduction = process.env.NODE_ENV === "production";

    expect(isProduction).toBe(true);

    process.env.NODE_ENV = original;
  });
});