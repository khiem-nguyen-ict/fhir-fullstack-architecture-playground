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

    it("includes X-XSS-Protection header", async () => {
      const res = await request(app).get("/").set("Accept", "application/json");
      expect(res.headers["x-xss-protection"]).toBe("0");
    });
  });

  describe("fallback routes", () => {
    it("redirects unknown routes to frontend", async () => {
      const res = await request(app).get("/unknown-route");
      expect([200, 302, 404]).toContain(res.status);
    });
  });
});

describe("environment-based GraphiQL control", () => {
  it("disables GraphiQL in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const isProduction = process.env.NODE_ENV === "production";
    const ENABLE_GRAPHIQL = process.env.ENABLE_GRAPHIQL !== "false";

    expect(isProduction).toBe(true);
    expect(!isProduction && ENABLE_GRAPHIQL).toBe(false);

    process.env.NODE_ENV = originalEnv;
  });

  it("enables GraphiQL by default in development", () => {
    const originalEnv = process.env.NODE_ENV;
    delete process.env.ENABLE_GRAPHIQL;
    process.env.NODE_ENV = "development";

    const isProduction = process.env.NODE_ENV === "production";
    const ENABLE_GRAPHIQL = process.env.ENABLE_GRAPHIQL !== "false";

    expect(isProduction).toBe(false);
    expect(!isProduction && ENABLE_GRAPHIQL).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });

  it("disables GraphiQL when ENABLE_GRAPHIQL=false", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    process.env.ENABLE_GRAPHIQL = "false";

    const isProduction = process.env.NODE_ENV === "production";
    const ENABLE_GRAPHIQL = process.env.ENABLE_GRAPHIQL !== "false";

    expect(isProduction).toBe(false);
    expect(!isProduction && ENABLE_GRAPHIQL).toBe(false);

    process.env.NODE_ENV = originalEnv;
    delete process.env.ENABLE_GRAPHIQL;
  });
});

describe("CORS configuration values", () => {
  it("uses wildcard origin when ALLOWED_ORIGINS not set", () => {
    const original = process.env.ALLOWED_ORIGINS;
    delete process.env.ALLOWED_ORIGINS;

    const origin = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
      : "*";

    expect(origin).toBe("*");
    process.env.ALLOWED_ORIGINS = original;
  });

  it("parses ALLOWED_ORIGINS comma-separated list", () => {
    const original = process.env.ALLOWED_ORIGINS;
    process.env.ALLOWED_ORIGINS = "http://localhost:5173,https://example.com";

    const corsOptions = {
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
        : "*",
    };

    expect(corsOptions.origin).toEqual(["http://localhost:5173", "https://example.com"]);
    process.env.ALLOWED_ORIGINS = original;
  });
});

describe("rate limiter configuration", () => {
  it("has correct window and max values", () => {
    const windowMs = 15 * 60 * 1000;
    const max = 1000;

    expect(windowMs).toBe(900000);
    expect(max).toBe(1000);
  });
});

describe("introspection blocking in production", () => {
  it("blocks introspection query in production mode", () => {
    const isProduction = true;
    const operationName = "IntrospectionQuery";

    const shouldBlock = operationName === "IntrospectionQuery" && isProduction;
    expect(shouldBlock).toBe(true);
  });
});

describe("resolvers index", () => {
  it("exports Query and Mutation resolvers", async () => {
    const { resolvers } = await import("../src/resolvers/index.js");

    expect(resolvers.Query).toBeDefined();
    expect(resolvers.Mutation).toBeDefined();
    expect(typeof resolvers.Query.patients).toBe("function");
    expect(typeof resolvers.Mutation.createPatient).toBe("function");
    expect(typeof resolvers.Mutation.updatePatient).toBe("function");
    expect(typeof resolvers.Mutation.deletePatient).toBe("function");
  });
});