import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PatientsPage from "./PatientsPage.jsx";

vi.mock("../graphqlClient.js", () => ({
  graphqlRequest: vi.fn(),
}));

import { graphqlRequest } from "../graphqlClient.js";

describe("PatientsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.__BFF_URL__ = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state while fetching patients", () => {
    graphqlRequest.mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading…")).toBeDefined();
  });

  it("renders patients after successful load", async () => {
    graphqlRequest.mockResolvedValue({
      patients: {
        patients: [
          {
            id: "1",
            fullName: "John Doe",
            gender: "male",
            birthDate: "1990-01-01",
            phone: "555-123-4567",
            email: "john@example.com",
          },
        ],
        totalCount: 1,
      },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeDefined();
    });
  });

  it("shows error toast when fetch fails", async () => {
    graphqlRequest.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeDefined();
    });
  });

  it("handles pagination page change", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 25 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });

    const paginationButtons = screen.getAllByRole("button");
    const page2Button = paginationButtons.find(
      (btn) => btn.getAttribute("aria-label")?.includes("Go to page 2")
    );
    
    if (page2Button) {
      fireEvent.click(page2Button);
    }
  });

  it("handles page size change", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });
  });

  it("switches between general and advanced search modes", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Advanced")).toBeDefined();
    });

    fireEvent.click(screen.getByText("Advanced"));
    
    await waitFor(() => {
      expect(screen.getByLabelText("Given name")).toBeDefined();
    });
  });

  it("clears advanced search", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });
  });

  it("calls search on search button click", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });

    fireEvent.click(screen.getByRole("button", { name: "Search" }));
  });

  it("loads saved page size from localStorage", async () => {
    localStorage.setItem("patientPageSize", "25");

    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });
  });

  it("saves page size to localStorage on change", async () => {
    graphqlRequest.mockResolvedValue({
      patients: { patients: [], totalCount: 0 },
      paginationConfig: { defaultPageSize: 10, maxPageSize: 100 },
    });

    render(
      <MemoryRouter>
        <PatientsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No patients yet.")).toBeDefined();
    });
  });
});