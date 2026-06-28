import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    window.__BFF_URL__ = "";
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        data: {
          patients: { patients: [], totalCount: 0 },
          paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
        },
      }),
    });
  });

  it("renders the header with icon", async () => {
    render(
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("FHIR Full-Stack Architecture Playground")).toBeDefined();
    });
    expect(screen.getByTestId("MedicalServicesIcon")).toBeDefined();
  });
});
