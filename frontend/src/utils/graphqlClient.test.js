import { describe, it, expect, vi, beforeEach } from "vitest";
import * as graphqlClientModule from "../graphqlClient.js";

describe("graphqlClient", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("makes POST request with correct payload", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: { patients: [] } }),
    });

    await graphqlClientModule.graphqlRequest("{ patients { id } }", { id: 1 });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "{ patients { id } }", variables: { id: 1 } }),
      })
    );
  });

  it("returns data from successful response", async () => {
    const mockData = { patients: [{ id: "1", name: "John" }] };
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ data: mockData }),
    });

    const result = await graphqlClientModule.graphqlRequest("{ patients { id name } }");

    expect(result).toEqual(mockData);
  });

  it("throws error with original message when no HTML in error", async () => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          errors: [{ message: "Patient not found" }],
        }),
    });

    await expect(graphqlClientModule.graphqlRequest("{ patient(id: 1) }")).rejects.toThrow(
      "Patient not found"
    );
  });

  it("throws combined error messages when multiple errors", async () => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          errors: [{ message: "Error 1" }, { message: "Error 2" }],
        }),
    });

    await expect(graphqlClientModule.graphqlRequest("{ patients }")).rejects.toThrow("Error 1; Error 2");
  });

  it("replaces HTML error messages with user-friendly message", async () => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          errors: [{ message: "<html><body>Service unavailable</body></html>" }],
        }),
    });

    await expect(graphqlClientModule.graphqlRequest("{ patients }")).rejects.toThrow(
      "Unable to connect to the service. Please try again later."
    );
  });

  it("handles mixed HTML and non-HTML errors", async () => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          errors: [
            { message: "<html>Error page</html>" },
            { message: "Validation failed" },
          ],
        }),
    });

    await expect(graphqlClientModule.graphqlRequest("{ patients }")).rejects.toThrow(
      "Unable to connect to the service. Please try again later.; Validation failed"
    );
  });
});