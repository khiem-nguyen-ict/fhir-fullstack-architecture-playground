import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../context/ThemeContext.jsx";

const TestComponent = () => {
  const { mode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders in light mode", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("toggles theme", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode").textContent).toBe("light");

    act(() => {
      fireEvent.click(screen.getByText("Toggle"));
    });

    expect(screen.getByTestId("mode").textContent).toBe("dark");

    act(() => {
      fireEvent.click(screen.getByText("Toggle"));
    });

    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("saves mode to localStorage on toggle", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.click(screen.getByText("Toggle"));
    });

    expect(localStorage.getItem("themeMode")).toBe("dark");
  });

  it("loads mode from localStorage", () => {
    localStorage.setItem("themeMode", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode").textContent).toBe("dark");
  });
});