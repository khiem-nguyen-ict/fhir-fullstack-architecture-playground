import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PatientForm from "./PatientForm.jsx";

describe("PatientForm", () => {
  it("renders form fields", () => {
    render(<PatientForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Given name/)).toBeDefined();
    expect(screen.getByLabelText(/Family name/)).toBeDefined();
    expect(screen.getByRole("combobox", { name: /Gender/ })).toBeDefined();
    expect(screen.getByLabelText("Phone")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
  });

  it("renders Add Patient button", () => {
    render(<PatientForm onSubmit={() => {}} />);
    const submitButtons = screen.getAllByRole("button", { name: "Add Patient" });
    const addPatientButton = submitButtons.find((b) => b.type === "submit");
    expect(addPatientButton).toBeDefined();
  });
});