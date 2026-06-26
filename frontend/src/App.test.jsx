import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    window.__BFF_URL__ = "";
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: { patients: [] } }),
    });
  });

  it("renders the header", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("FHIR Full-Stack Architecture Playground")).toBeDefined();
    });
  });
});
