import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToastBox from "./ToastBox.jsx";

describe("ToastBox", () => {
  it("renders error type", () => {
    render(<ToastBox type="error" message="Something went wrong" />);
    expect(screen.getByText(/Something went wrong/)).toBeDefined();
    expect(screen.getByText(/⚠/)).toBeDefined();
  });

  it("renders success type", () => {
    render(<ToastBox type="success" message="Operation completed" />);
    expect(screen.getByText(/Operation completed/)).toBeDefined();
    expect(screen.getByText(/✓/)).toBeDefined();
  });

  it("renders warning type", () => {
    render(<ToastBox type="warning" message="Please check input" />);
    expect(screen.getByText(/Please check input/)).toBeDefined();
    expect(screen.getByText(/⚠/)).toBeDefined();
  });

  it("renders information type", () => {
    render(<ToastBox type="information" message="For your info" />);
    expect(screen.getByText(/For your info/)).toBeDefined();
    expect(screen.getByText(/ℹ/)).toBeDefined();
  });
});