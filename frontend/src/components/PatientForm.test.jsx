import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("blocks submit when email is empty and shows inline error", async () => {
    const mockOnSubmit = vi.fn();
    render(<PatientForm onSubmit={mockOnSubmit} />);
    
    const emailField = screen.getByLabelText("Email");
    fireEvent.blur(emailField);
    
    const submitButton = screen.getByRole("button", { name: "Add Patient" });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeDefined();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("blocks submit when email is malformed and shows inline error", async () => {
    const mockOnSubmit = vi.fn();
    render(<PatientForm onSubmit={mockOnSubmit} />);
    
    const emailField = screen.getByLabelText("Email");
    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.blur(emailField);
    
    const submitButton = screen.getByRole("button", { name: "Add Patient" });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeDefined();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("blocks submit when phone is empty and shows inline error", async () => {
    const mockOnSubmit = vi.fn();
    render(<PatientForm onSubmit={mockOnSubmit} />);
    
    const phoneField = screen.getByLabelText("Phone");
    fireEvent.blur(phoneField);
    
    const submitButton = screen.getByRole("button", { name: "Add Patient" });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Phone is required")).toBeDefined();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("blocks submit when phone is malformed and shows inline error", async () => {
    const mockOnSubmit = vi.fn();
    render(<PatientForm onSubmit={mockOnSubmit} />);
    
    const phoneField = screen.getByLabelText("Phone");
    fireEvent.change(phoneField, { target: { value: "123" } });
    fireEvent.blur(phoneField);
    
    const submitButton = screen.getByRole("button", { name: "Add Patient" });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Invalid phone number")).toBeDefined();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits successfully with valid data", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue();
    render(<PatientForm onSubmit={mockOnSubmit} />);
    
    const givenNameField = screen.getByLabelText(/Given name/);
    const familyNameField = screen.getByLabelText(/Family name/);
    const emailField = screen.getByLabelText("Email");
    const phoneField = screen.getByLabelText("Phone");
    
    fireEvent.change(givenNameField, { target: { value: "John" } });
    fireEvent.blur(givenNameField);
    fireEvent.change(familyNameField, { target: { value: "Doe" } });
    fireEvent.blur(familyNameField);
    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.blur(emailField);
    fireEvent.change(phoneField, { target: { value: "+1 (555) 123-4567" } });
    fireEvent.blur(phoneField);
    
    const submitButton = screen.getByRole("button", { name: "Add Patient" });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
    expect(mockOnSubmit.mock.calls[0][0]).toMatchObject({
      givenName: "John",
      familyName: "Doe",
      email: "test@example.com",
      phone: "+1 (555) 123-4567",
    });
  });

  it("renders cancel button when onCancel provided", () => {
    render(<PatientForm onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const mockOnCancel = vi.fn();
    render(<PatientForm onSubmit={() => {}} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("renders custom title when provided", () => {
    render(<PatientForm onSubmit={() => {}} title="Edit Patient" />);
    expect(screen.getByText("Edit Patient")).toBeDefined();
  });

  it("renders custom submit button text when provided", () => {
    render(<PatientForm onSubmit={() => {}} submitButtonText="Save Patient" />);
    expect(screen.getByRole("button", { name: "Save Patient" })).toBeDefined();
  });
});