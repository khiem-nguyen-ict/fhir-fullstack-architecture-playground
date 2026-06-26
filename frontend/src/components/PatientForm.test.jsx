import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PatientForm from "./PatientForm.jsx";

describe("PatientForm", () => {
  it("renders form fields", () => {
    render(<PatientForm onPatientAdded={() => {}} />);
    expect(screen.getByPlaceholderText("Given name")).toBeDefined();
    expect(screen.getByPlaceholderText("Family name")).toBeDefined();
    expect(screen.getByText("Gender")).toBeDefined();
    expect(screen.getByPlaceholderText("Phone")).toBeDefined();
    expect(screen.getByPlaceholderText("Email")).toBeDefined();
  });

  it("renders Add Patient button", () => {
    render(<PatientForm onPatientAdded={() => {}} />);
    const submitButtons = screen.getAllByRole("button", { name: "Add Patient" });
    const addPatientButton = submitButtons.find((b) => b.type === "submit");
    expect(addPatientButton).toBeDefined();
  });
});