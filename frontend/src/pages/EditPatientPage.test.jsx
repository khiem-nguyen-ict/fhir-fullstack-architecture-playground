import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditPatientPage from "./EditPatientPage.jsx";

vi.mock("../graphqlClient.js", () => ({
  graphqlRequest: vi.fn(),
}));

import { graphqlRequest } from "../graphqlClient.js";

describe("EditPatientPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.__BFF_URL__ = "";
  });

  it("shows loading state initially", () => {
    graphqlRequest.mockResolvedValue({ patient: null });
    
    render(
      <MemoryRouter>
        <EditPatientPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading…")).toBeDefined();
  });

  it("loads patient data and shows form", async () => {
    graphqlRequest.mockResolvedValue({
      patient: {
        id: "1",
        givenName: "John",
        familyName: "Doe",
        gender: "male",
        birthDate: "1990-01-15",
        phone: "555-1234",
        email: "john@example.com",
      },
    });

    render(
      <MemoryRouter>
        <EditPatientPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Patient")).toBeDefined();
    });
  });

  it("shows loading on error loading patient", async () => {
    graphqlRequest.mockRejectedValue(new Error("Patient not found"));

    render(
      <MemoryRouter>
        <EditPatientPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Loading…")).toBeDefined();
    });
  });
});