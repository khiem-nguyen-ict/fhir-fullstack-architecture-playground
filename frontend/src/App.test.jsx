import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
  it("renders the header", () => {
    render(<App />);
    expect(screen.getByText("FHIR Full-Stack Architecture Playground")).toBeDefined();
  });
});
