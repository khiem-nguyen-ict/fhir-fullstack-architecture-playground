import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PatientSearch from "./PatientSearch.jsx";

const defaultProps = {
  searchMode: "general",
  onModeChange: vi.fn(),
  generalSearch: "",
  onGeneralSearchChange: vi.fn(),
  advancedSearch: {
    givenName: "",
    familyName: "",
    gender: "",
    birthDate: "",
    phone: "",
    email: "",
  },
  onAdvancedSearchChange: vi.fn(),
  onClearSearch: vi.fn(),
  onSearch: vi.fn(),
};

describe("PatientSearch", () => {
  it("renders general and advanced toggle buttons", () => {
    render(<PatientSearch {...defaultProps} />);
    expect(screen.getByText("General")).toBeDefined();
    expect(screen.getByText("Advanced")).toBeDefined();
  });

  it("renders general search input and search button in general mode", () => {
    render(<PatientSearch {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Search by name/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Search" })).toBeDefined();
  });

  it("does not render advanced fields in general mode", () => {
    render(<PatientSearch {...defaultProps} />);
    expect(screen.queryByLabelText("Given name")).toBeNull();
    expect(screen.queryByLabelText("Family name")).toBeNull();
  });

  it("renders advanced fields and buttons in advanced mode", () => {
    render(<PatientSearch {...defaultProps} searchMode="advanced" />);
    expect(screen.getByLabelText("Given name")).toBeDefined();
    expect(screen.getByLabelText("Family name")).toBeDefined();
    expect(screen.getByLabelText("Gender")).toBeDefined();
    expect(screen.getByLabelText("Birth date")).toBeDefined();
    expect(screen.getByLabelText("Phone")).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByText("Clear search")).toBeDefined();
    expect(screen.getByRole("button", { name: "Search" })).toBeDefined();
  });

  it("does not render general search input in advanced mode", () => {
    render(<PatientSearch {...defaultProps} searchMode="advanced" />);
    expect(screen.queryByPlaceholderText(/Search by name/)).toBeNull();
  });

  it("calls onGeneralSearchChange when typing in general mode", () => {
    const onGeneralSearchChange = vi.fn();
    render(<PatientSearch {...defaultProps} onGeneralSearchChange={onGeneralSearchChange} />);
    const input = screen.getByPlaceholderText(/Search by name/);
    fireEvent.change(input, { target: { value: "john" } });
    expect(onGeneralSearchChange).toHaveBeenCalledTimes(1);
    expect(onGeneralSearchChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.anything() }));
  });

  it("calls onAdvancedSearchChange when typing in advanced mode", () => {
    const onAdvancedSearchChange = vi.fn();
    render(<PatientSearch {...defaultProps} searchMode="advanced" onAdvancedSearchChange={onAdvancedSearchChange} />);
    const input = screen.getByLabelText("Given name");
    fireEvent.change(input, { target: { value: "John" } });
    expect(onAdvancedSearchChange).toHaveBeenCalledWith("givenName", "John");
  });

  it("calls onSearch when search button is clicked in general mode", () => {
    const onSearch = vi.fn();
    render(<PatientSearch {...defaultProps} onSearch={onSearch} />);
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalled();
  });

  it("calls onSearch when search button is clicked in advanced mode", () => {
    const onSearch = vi.fn();
    render(<PatientSearch {...defaultProps} searchMode="advanced" onSearch={onSearch} />);
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearch).toHaveBeenCalled();
  });

  it("calls onClearSearch when clear button is clicked in advanced mode", () => {
    const onClearSearch = vi.fn();
    render(<PatientSearch {...defaultProps} searchMode="advanced" onClearSearch={onClearSearch} />);
    fireEvent.click(screen.getByText("Clear search"));
    expect(onClearSearch).toHaveBeenCalled();
  });

  it("calls onModeChange when toggle button is clicked", () => {
    const onModeChange = vi.fn();
    render(<PatientSearch {...defaultProps} onModeChange={onModeChange} />);
    fireEvent.click(screen.getByText("Advanced"));
    expect(onModeChange).toHaveBeenCalledWith(expect.anything(), "advanced");
  });

  it("calls onSearch when Enter key is pressed in general search input", () => {
    const onSearch = vi.fn();
    render(<PatientSearch {...defaultProps} onSearch={onSearch} />);
    const form = screen.getByRole("button", { name: "Search" }).closest("form");
    fireEvent.submit(form);
    expect(onSearch).toHaveBeenCalled();
  });

  it("calls onSearch when Enter key is pressed in advanced search field", () => {
    const onSearch = vi.fn();
    render(<PatientSearch {...defaultProps} searchMode="advanced" onSearch={onSearch} />);
    const form = screen.getByRole("button", { name: "Search" }).closest("form");
    fireEvent.submit(form);
    expect(onSearch).toHaveBeenCalled();
  });
});