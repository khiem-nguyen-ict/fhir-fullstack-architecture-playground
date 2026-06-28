import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PatientList from "./PatientList.jsx";

describe("PatientList", () => {
  it("renders empty state when no patients", () => {
    render(
      <BrowserRouter>
        <PatientList patients={[]} onPatientDeleted={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText("No patients yet.")).toBeDefined();
  });

  it("renders patients table with clickable phone and email when patients exist", () => {
    const mockPatients = [
      {
        id: "1",
        fullName: "John Doe",
        gender: "male",
        birthDate: "1990-01-01",
        phone: "555-1234",
        email: "john@example.com",
      },
    ];
    render(
      <BrowserRouter>
        <PatientList patients={mockPatients} onPatientDeleted={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("male")).toBeDefined();
    expect(screen.getByText("01/01/1990")).toBeDefined();
    expect(screen.getByText("555 1234")).toBeDefined();

    const phoneLink = screen.getByText("555 1234").closest("a");
    expect(phoneLink?.getAttribute("href")).toBe("tel:5551234");

    expect(screen.getByText("john@example.com")).toBeDefined();
    const emailLink = screen.getByText("john@example.com").closest("a");
    expect(emailLink?.getAttribute("href")).toBe("mailto:john@example.com");
  });

  it("renders em dash when phone or email is missing", () => {
    const mockPatients = [
      {
        id: "1",
        fullName: "Jane Doe",
        gender: "female",
        birthDate: "1985-05-15",
      },
    ];
    render(
      <BrowserRouter>
        <PatientList patients={mockPatients} onPatientDeleted={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2);
  });

  it("renders ColumnHeader with sort functionality", () => {
    const mockPatients = [
      {
        id: "1",
        fullName: "John Doe",
        gender: "male",
        birthDate: "1990-01-01",
        phone: "555-1234",
        email: "john@example.com",
      },
    ];
    const onSort = vi.fn();
    
    render(
      <BrowserRouter>
        <PatientList patients={mockPatients} onPatientDeleted={() => {}} sortBy="fullName" sortDirection="asc" onSort={onSort} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Name"));
    expect(onSort).toHaveBeenCalledWith("fullName");
  });
});