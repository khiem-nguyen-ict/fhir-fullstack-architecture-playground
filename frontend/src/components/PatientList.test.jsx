import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("renders patients table when patients exist", () => {
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
    expect(screen.getByText("1990-01-01")).toBeDefined();
    expect(screen.getByText("555-1234")).toBeDefined();
    expect(screen.getByText("john@example.com")).toBeDefined();
  });
});